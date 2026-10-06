import { useEffect, useMemo, useState } from "react";

import {useNavigate,useSearchParams} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AdminOrders() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const selectedStatus =
        searchParams.get("status");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/order/list`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`
                        }
                    }
                );

                const result =
                    await response.json();

                if (
                    !response.ok ||
                    !result.status
                ) {
                    throw new Error(
                        result.message ||
                            "Failed to fetch orders"
                    );
                }

                setOrders(result.data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    /*
     * =====================================================
     * REQUEST COUNTS
     * =====================================================
     */

    const requestCounts = useMemo(() => {
        let cancelled = 0;
        let returnRequests = 0;
        let exchangeRequests = 0;

        orders.forEach((order) => {
            order.items?.forEach((item) => {
                if (
                    item.cancelStatus ===
                    "cancelled"
                ) {
                    cancelled++;
                }

                if (
                    item.returnStatus ===
                    "return_requested"
                ) {
                    returnRequests++;
                }

                if (
                    item.exchangeStatus ===
                    "exchange_requested"
                ) {
                    exchangeRequests++;
                }
            });
        });

        return {
            cancelled,
            returnRequests,
            exchangeRequests
        };
    }, [orders]);

    /*
     * =====================================================
     * ORDER COUNTS
     * =====================================================
     */

    const counts = useMemo(() => {
        return {
            all: orders.length,

            pending: orders.filter(
                (order) =>
                    order.status ===
                    "pending"
            ).length,

            confirmed: orders.filter(
                (order) =>
                    order.status ===
                    "confirmed"
            ).length,

            delivered: orders.filter(
                (order) =>
                    order.status ===
                    "delivered"
            ).length
        };
    }, [orders]);

    /*
     * =====================================================
     * FILTER ORDERS
     * =====================================================
     */

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const statusMatch =
                !selectedStatus ||
                order.status ===
                    selectedStatus;

            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            if (!searchValue) {
                return statusMatch;
            }

            const orderId =
                order._id?.toLowerCase() ||
                "";

            const customerName =
                order.userId?.name?.toLowerCase() ||
                "";

            const customerEmail =
                order.userId?.email?.toLowerCase() ||
                "";

            return (
                statusMatch &&
                (
                    orderId.includes(
                        searchValue
                    ) ||
                    customerName.includes(
                        searchValue
                    ) ||
                    customerEmail.includes(
                        searchValue
                    )
                )
            );
        });
    }, [
        orders,
        selectedStatus,
        search
    ]);

    /*
     * =====================================================
     * FILTER CHANGE
     * =====================================================
     */

    const changeFilter = (status) => {
        if (status === "all") {
            navigate("/admin/orders");
            return;
        }

        navigate(
            `/admin/orders?status=${status}`
        );
    };

    /*
     * =====================================================
     * FORMAT TIME
     * =====================================================
     */

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    /*
     * =====================================================
     * FORMAT AMOUNT
     * =====================================================
     */

    const formatAmount = (amount) => {
        return Number(
            amount || 0
        ).toLocaleString("en-IN");
    };

    /*
     * =====================================================
     * HANDLE RETURN / EXCHANGE
     * =====================================================
     */

    const handleRequestAction = async (
        orderId,
        itemId,
        type,
        action
    ) => {
        const actionKey =
            `${type}-${action}-${itemId}`;

        try {
            setActionLoading(actionKey);

            let endpoint = "";

            if (
                type === "return" &&
                action === "approve"
            ) {
                endpoint =
                    `/order/${orderId}/item/${itemId}/return/approve`;
            }

            if (
                type === "return" &&
                action === "reject"
            ) {
                endpoint =
                    `/order/${orderId}/item/${itemId}/return/reject`;
            }

            if (
                type === "exchange" &&
                action === "approve"
            ) {
                endpoint =
                    `/order/${orderId}/item/${itemId}/exchange/approve`;
            }

            if (
                type === "exchange" &&
                action === "reject"
            ) {
                endpoint =
                    `/order/${orderId}/item/${itemId}/exchange/reject`;
            }

            if (!endpoint) {
                return;
            }

            const response = await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.status
            ) {
                throw new Error(
                    result.message ||
                        `Failed to ${action} ${type} request`
                );
            }

            /*
             * Update the order inside the page
             * without refreshing the browser.
             */

            setOrders((previousOrders) =>
                previousOrders.map(
                    (order) => {
                        if (
                            order._id !==
                            orderId
                        ) {
                            return order;
                        }

                        return {
                            ...order,
                            items:
                                order.items?.map(
                                    (item) => {
                                        if (
                                            item._id !==
                                            itemId
                                        ) {
                                            return item;
                                        }

                                        if (
                                            type ===
                                            "return"
                                        ) {
                                            return {
                                                ...item,
                                                returnStatus:
                                                    action ===
                                                    "approve"
                                                        ? "return_approved"
                                                        : "return_rejected"
                                            };
                                        }

                                        if (
                                            type ===
                                            "exchange"
                                        ) {
                                            return {
                                                ...item,
                                                exchangeStatus:
                                                    action ===
                                                    "approve"
                                                        ? "exchange_approved"
                                                        : "exchange_rejected"
                                            };
                                        }

                                        return item;
                                    }
                                )
                        };
                    }
                )
            );

        } catch (error) {
            alert(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    /*
     * =====================================================
     * GET ITEM REQUESTS
     * =====================================================
     */

    const getItemRequests = (order) => {
        const requests = [];

        order.items?.forEach((item) => {
            if (
                item.cancelStatus ===
                "cancelled"
            ) {
                requests.push({
                    type: "cancelled",
                    item
                });
            }

            if (
                item.returnStatus ===
                "return_requested"
            ) {
                requests.push({
                    type: "return",
                    item
                });
            }

            if (
                item.exchangeStatus ===
                "exchange_requested"
            ) {
                requests.push({
                    type: "exchange",
                    item
                });
            }
        });

        return requests;
    };

    /*
     * =====================================================
     * LOADING
     * =====================================================
     */

    if (loading) {
        return (
            <div className="exact-admin-page">
                <div className="exact-admin-loading">
                    Loading orders...
                </div>
            </div>
        );
    }

    /*
     * =====================================================
     * ERROR
     * =====================================================
     */

    if (error) {
        return (
            <div className="exact-admin-page">
                <div className="exact-admin-error">
                    {error}
                </div>

                <button
                    className="exact-admin-primary-button"
                    onClick={() =>
                        window.location.reload()
                    }
                >
                    Try Again
                </button>
            </div>
        );
    }

    /*
     * =====================================================
     * MAIN UI
     * =====================================================
     */

    return (
        <div className="exact-admin-page exact-admin-orders-page">

            {/* PAGE HEADING */}

            <div className="exact-admin-orders-heading">

                <div>
                    <h1>
                        Admin Orders
                    </h1>

                    <p>
                        Manage and track all customer orders.
                    </p>
                </div>

                <button
                    className="exact-admin-back-button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Back to Dashboard
                </button>

            </div>

            {/* REQUEST SUMMARY */}

            <div className="admin-request-summary">

                <div className="admin-request-card cancelled">
                    <span className="admin-request-icon">
                        ✕
                    </span>

                    <div>
                        <strong>
                            {requestCounts.cancelled}
                        </strong>

                        <span>
                            Cancelled Products
                        </span>
                    </div>
                </div>

                <div className="admin-request-card return">
                    <span className="admin-request-icon">
                        ↩
                    </span>

                    <div>
                        <strong>
                            {requestCounts.returnRequests}
                        </strong>

                        <span>
                            Return Requests
                        </span>
                    </div>
                </div>

                <div className="admin-request-card exchange">
                    <span className="admin-request-icon">
                        ⇄
                    </span>

                    <div>
                        <strong>
                            {requestCounts.exchangeRequests}
                        </strong>

                        <span>
                            Exchange Requests
                        </span>
                    </div>
                </div>

            </div>

            {/* ORDER STATUS FILTERS */}

            <div className="exact-admin-order-filters">

                <button
                    className={
                        !selectedStatus
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        changeFilter("all")
                    }
                >
                    All Orders

                    <span>
                        {counts.all}
                    </span>
                </button>

                <button
                    className={
                        selectedStatus ===
                        "pending"
                            ? "active pending"
                            : ""
                    }
                    onClick={() =>
                        changeFilter("pending")
                    }
                >
                    Pending

                    <span>
                        {counts.pending}
                    </span>
                </button>

                <button
                    className={
                        selectedStatus ===
                        "confirmed"
                            ? "active confirmed"
                            : ""
                    }
                    onClick={() =>
                        changeFilter(
                            "confirmed"
                        )
                    }
                >
                    Confirmed

                    <span>
                        {counts.confirmed}
                    </span>
                </button>

                <button
                    className={
                        selectedStatus ===
                        "delivered"
                            ? "active delivered"
                            : ""
                    }
                    onClick={() =>
                        changeFilter(
                            "delivered"
                        )
                    }
                >
                    Delivered

                    <span>
                        {counts.delivered}
                    </span>
                </button>

            </div>

            {/* SEARCH */}

            <div className="exact-admin-search">

                <span>
                    ⌕
                </span>

                <input
                    type="text"
                    placeholder="Search by order ID, customer name or email..."
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />

                <button
                    type="button"
                    onClick={() =>
                        setSearch(
                            search.trim()
                        )
                    }
                >
                    🔍
                </button>

            </div>

            {/* ORDERS */}

            {filteredOrders.length === 0 ? (

                <div className="exact-admin-empty-panel">

                    <h2>
                        No Orders Found
                    </h2>

                    <p>
                        There are no orders matching your current filter.
                    </p>

                </div>

            ) : (

                <div className="exact-admin-orders-list">

                    {filteredOrders.map(
                        (order) => {

                            const itemRequests =
                                getItemRequests(
                                    order
                                );

                            return (
                                <div
                                    className="exact-admin-order-row"
                                    key={order._id}
                                >

                                    <div className="exact-admin-order-main">

                                        {/* ORDER NUMBER */}

                                        <div className="exact-admin-order-number">

                                            <strong>
                                                #
                                                {order._id.slice(
                                                    -8
                                                )}
                                            </strong>

                                            <span>
                                                {order.createdAt
                                                    ? new Date(
                                                          order.createdAt
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric"
                                                          }
                                                      )
                                                    : "N/A"}

                                                ,{" "}

                                                {formatTime(
                                                    order.createdAt
                                                )}
                                            </span>

                                        </div>

                                        {/* CUSTOMER */}

                                        <div className="exact-admin-customer">

                                            <div className="exact-admin-customer-avatar">

                                                {(
                                                    order
                                                        .userId
                                                        ?.name ||
                                                    "U"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        order
                                                            .userId
                                                            ?.name ||
                                                        "Not available"
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        order
                                                            .userId
                                                            ?.email ||
                                                        "Not available"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                        {/* ORDER META */}

                                        <div className="exact-admin-order-meta">

                                            <strong>
                                                {order.items?.reduce(
                                                    (
                                                        total,
                                                        item
                                                    ) =>
                                                        total +
                                                        Number(
                                                            item.quantity ||
                                                                0
                                                        ),
                                                    0
                                                )}{" "}
                                                items
                                            </strong>

                                            <span>
                                                ₹
                                                {formatAmount(
                                                    order.totalAmount
                                                )}
                                            </span>

                                        </div>

                                        {/* ORDER STATUS */}

                                        <span
                                            className={`exact-status-badge ${order.status}`}
                                        >
                                            {order.status}
                                        </span>

                                        {/* VIEW DETAILS */}

                                        <button
                                            className="exact-admin-view-button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/orders/${order._id}`
                                                )
                                            }
                                        >
                                            View Details →
                                        </button>

                                    </div>

                                    {/* =================================================
                                        CUSTOMER REQUESTS
                                    ================================================= */}

                                    {itemRequests.length >
                                        0 && (

                                        <div className="admin-order-requests">

                                            <div className="admin-order-requests-title">
                                                Customer Product Requests
                                            </div>

                                            {itemRequests.map(
                                                ({
                                                    type,
                                                    item
                                                }) => {

                                                    const approveKey =
                                                        `${type}-approve-${item._id}`;

                                                    const rejectKey =
                                                        `${type}-reject-${item._id}`;

                                                    return (
                                                        <div
                                                            className={`admin-order-request ${type}`}
                                                            key={`${type}-${item._id}`}
                                                        >

                                                            {/* PRODUCT NAME */}

                                                            <div className="admin-request-product">

                                                                <strong>
                                                                    {item.name ||
                                                                        "Product"}
                                                                </strong>

                                                                <span>
                                                                    Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>

                                                            </div>

                                                            {/* CANCELLED */}

                                                            {type ===
                                                                "cancelled" && (

                                                                <div className="admin-request-status cancelled-status">
                                                                    Product Cancelled
                                                                </div>
                                                            )}

                                                            {/* RETURN */}

                                                            {type ===
                                                                "return" && (

                                                                <>
                                                                    <div className="admin-request-status return-status">
                                                                        Return Requested
                                                                    </div>

                                                                    <div className="admin-request-actions">

                                                                        <button
                                                                            className="admin-approve-button"
                                                                            disabled={
                                                                                actionLoading ===
                                                                                approveKey
                                                                            }
                                                                            onClick={() =>
                                                                                handleRequestAction(
                                                                                    order._id,
                                                                                    item._id,
                                                                                    "return",
                                                                                    "approve"
                                                                                )
                                                                            }
                                                                        >
                                                                            {actionLoading ===
                                                                            approveKey
                                                                                ? "Approving..."
                                                                                : "Approve"}
                                                                        </button>

                                                                        <button
                                                                            className="admin-reject-button"
                                                                            disabled={
                                                                                actionLoading ===
                                                                                rejectKey
                                                                            }
                                                                            onClick={() =>
                                                                                handleRequestAction(
                                                                                    order._id,
                                                                                    item._id,
                                                                                    "return",
                                                                                    "reject"
                                                                                )
                                                                            }
                                                                        >
                                                                            {actionLoading ===
                                                                            rejectKey
                                                                                ? "Rejecting..."
                                                                                : "Reject"}
                                                                        </button>

                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* EXCHANGE */}

                                                            {type ===
                                                                "exchange" && (

                                                                <>
                                                                    <div className="admin-request-status exchange-status">
                                                                        Exchange Requested
                                                                    </div>

                                                                    <div className="admin-request-actions">

                                                                        <button
                                                                            className="admin-approve-button"
                                                                            disabled={
                                                                                actionLoading ===
                                                                                approveKey
                                                                            }
                                                                            onClick={() =>
                                                                                handleRequestAction(
                                                                                    order._id,
                                                                                    item._id,
                                                                                    "exchange",
                                                                                    "approve"
                                                                                )
                                                                            }
                                                                        >
                                                                            {actionLoading ===
                                                                            approveKey
                                                                                ? "Approving..."
                                                                                : "Approve"}
                                                                        </button>

                                                                        <button
                                                                            className="admin-reject-button"
                                                                            disabled={
                                                                                actionLoading ===
                                                                                rejectKey
                                                                            }
                                                                            onClick={() =>
                                                                                handleRequestAction(
                                                                                    order._id,
                                                                                    item._id,
                                                                                    "exchange",
                                                                                    "reject"
                                                                                )
                                                                            }
                                                                        >
                                                                            {actionLoading ===
                                                                            rejectKey
                                                                                ? "Rejecting..."
                                                                                : "Reject"}
                                                                        </button>

                                                                    </div>
                                                                </>
                                                            )}

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>
                                    )}

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}

export default AdminOrders;