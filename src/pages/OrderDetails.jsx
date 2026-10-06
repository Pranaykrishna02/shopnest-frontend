import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/Context";
import OrderStatus from "../components/OrderStatus";

const API_URL = process.env.REACT_APP_API_URL;

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, isLoggedIn } = useAppContext();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [cancellingItemId, setCancellingItemId] = useState(null);
    const [returningItemId, setReturningItemId] = useState(null);

    const [successPopup, setSuccessPopup] = useState({
        show: false,
        title: "",
        message: ""
    });

    const [confirmPopup, setConfirmPopup] = useState({
        show: false,
        type: "",
        itemId: null,
        title: "",
        message: ""
    });

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/order/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.status) {
                    throw new Error(
                        result.message || "Failed to fetch order"
                    );
                }

                if (
                    result.data.userId?._id &&
                    result.data.userId._id !== currentUser?.userId
                ) {
                    throw new Error(
                        "You are not authorized to view this order"
                    );
                }

                setOrder(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, isLoggedIn, currentUser?.userId]);

    const handleCancelOrder = async () => {
        try {
            setCancelling(true);
            setError("");

            const response = await fetch(
                `${API_URL}/order/${id}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to cancel order"
                );
            }

            setOrder(result.data);

            setSuccessPopup({
                show: true,
                title: "Order Cancelled",
                message:
                    "Your entire order has been cancelled successfully."
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setCancelling(false);
        }
    };

    const handleCancelItem = async (itemId) => {
        try {
            setCancellingItemId(itemId);
            setError("");

            const response = await fetch(
                `${API_URL}/order/${id}/item/${itemId}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to cancel product"
                );
            }

            setOrder(result.data);

            setSuccessPopup({
                show: true,
                title: "Product Cancelled",
                message:
                    "The selected product has been cancelled successfully."
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setCancellingItemId(null);
        }
    };

    const handleReturnRequest = async (itemId) => {
        try {
            setReturningItemId(itemId);
            setError("");

            const response = await fetch(
                `${API_URL}/order/${id}/item/${itemId}/return`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to submit return request"
                );
            }

            setOrder(result.data);

            setSuccessPopup({
                show: true,
                title: "Return Request Submitted",
                message:
                    "Your return request has been submitted successfully."
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setReturningItemId(null);
        }
    };

    const openCancelOrderConfirmation = () => {
        setConfirmPopup({
            show: true,
            type: "cancelOrder",
            itemId: null,
            title: "Cancel Entire Order?",
            message:
                "Are you sure you want to cancel this entire order?"
        });
    };

    const openCancelItemConfirmation = (itemId) => {
        setConfirmPopup({
            show: true,
            type: "cancelItem",
            itemId,
            title: "Cancel Product?",
            message:
                "Are you sure you want to cancel this product?"
        });
    };

    const openReturnConfirmation = (itemId) => {
        setConfirmPopup({
            show: true,
            type: "returnItem",
            itemId,
            title: "Request Return?",
            message:
                "Are you sure you want to request a return for this product?"
        });
    };

    const closeConfirmPopup = () => {
        setConfirmPopup({
            show: false,
            type: "",
            itemId: null,
            title: "",
            message: ""
        });
    };

    const handleConfirmAction = () => {
        const { type, itemId } = confirmPopup;

        closeConfirmPopup();

        if (type === "cancelOrder") {
            handleCancelOrder();
        }

        if (type === "cancelItem") {
            handleCancelItem(itemId);
        }

        if (type === "returnItem") {
            handleReturnRequest(itemId);
        }
    };

    const closeSuccessPopup = () => {
        setSuccessPopup({
            show: false,
            title: "",
            message: ""
        });
    };

    if (!isLoggedIn) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">
                    <h1>Order Details</h1>

                    <div className="order-details-error">
                        Please login to view your order.
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">
                    <h1>Order Details</h1>

                    <div className="order-details-message">
                        Loading order details...
                    </div>
                </div>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="order-details-page">
                <div className="order-details-container">
                    <div className="order-details-error-icon">
                        !
                    </div>

                    <h1>Order Not Found</h1>

                    <p>
                        {error || "Unable to find this order."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const canCancel =
        order.status === "pending" ||
        order.status === "confirmed";

    const canReturnOrExchange =
        order.status === "delivered";

    return (
        <div className="order-details-page">
            <div className="order-details-container">
                <div className="order-details-header">
                    <div>
                        <h1>Order Details</h1>
                        <p>Order #{order._id}</p>
                    </div>

                    <OrderStatus status={order.status} />
                </div>

                <div className="order-details-section">
                    <h2>Order Information</h2>

                    <div className="order-details-grid">
                        <div>
                            <strong>Order ID</strong>
                            <p>{order._id}</p>
                        </div>

                        <div>
                            <strong>Order Date</strong>
                            <p>
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <strong>Payment Method</strong>
                            <p>
                                {order.paymentMethod ||
                                    "Not available"}
                            </p>
                        </div>

                        <div>
                            <strong>Order Status</strong>
                            <p>
                                <OrderStatus
                                    status={order.status}
                                />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="order-details-section">
                    <h2>Ordered Items</h2>

                    <div className="order-details-items">
                        {order.items?.map((item) => {
                            const returnStatus =
                                item.returnStatus || "normal";

                            const exchangeStatus =
                                item.exchangeStatus || "normal";

                            const exchangeDeliveryStatus =
                                item.exchangeDeliveryStatus ||
                                "not_started";

                            const cancelStatus =
                                item.cancelStatus || "normal";

                            const itemCancelled =
                                cancelStatus === "cancelled";

                            const returnRequested =
                                returnStatus !== "normal";

                            const exchangeRequested =
                                exchangeStatus !== "normal";

                            const exchangeRequest =
                                item.exchangeRequest || {};

                            const replacementProduct =
                                exchangeRequest.replacementProductId;

                            const replacementProductObject =
                                replacementProduct &&
                                typeof replacementProduct === "object"
                                    ? replacementProduct
                                    : null;

                            const replacementProductImage =
                                replacementProductObject?.image ||
                                replacementProductObject?.imageUrl ||
                                exchangeRequest.replacementProductImage ||
                                exchangeRequest.replacementImage ||
                                "https://via.placeholder.com/120?text=No+Image";

                            const replacementProductName =
                                replacementProductObject?.name ||
                                exchangeRequest.replacementProductName ||
                                "Replacement Product";

                            const replacementProductPrice =
                                replacementProductObject?.price ??
                                exchangeRequest.replacementProductPrice ??
                                null;

                            const exchangeIsConfirmed =
                                exchangeStatus ===
                                    "exchange_approved" ||
                                exchangeStatus === "exchanged";

                            const replacementIsShipped =
                                exchangeDeliveryStatus === "shipped" ||
                                exchangeDeliveryStatus === "delivered";

                            const replacementIsDelivered =
                                exchangeDeliveryStatus === "delivered" ||
                                exchangeStatus === "exchanged";

                            return (
                                <div
                                    className={`order-detail-item ${
                                        itemCancelled
                                            ? "cancelled-order-item"
                                            : ""
                                    }`}
                                    key={item._id}
                                >
                                    <div className="order-detail-item-image">
                                        <img
                                            src={
                                                item.productId?.image ||
                                                "https://via.placeholder.com/120?text=No+Image"
                                            }
                                            alt={
                                                item.name ||
                                                "Product"
                                            }
                                        />
                                    </div>

                                    <div className="order-detail-item-info">
                                        <div className="order-product-heading">
                                            <h3>{item.name}</h3>

                                            {exchangeRequested && (
                                                <span className="exchange-product-badge">
                                                    EXCHANGE
                                                </span>
                                            )}
                                        </div>

                                        <p>
                                            Quantity:{" "}
                                            {item.quantity}
                                        </p>

                                        <p>
                                            Price: ₹{item.price}
                                        </p>

                                        {itemCancelled && (
                                            <p className="cancelled-product-status">
                                                <strong>
                                                    Product Cancelled
                                                </strong>
                                            </p>
                                        )}

                                        {returnStatus !== "normal" && (
                                            <p>
                                                Return Status:{" "}
                                                <strong>
                                                    {returnStatus.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </strong>
                                            </p>
                                        )}

                                        {exchangeStatus !== "normal" && (
                                            <p className="exchange-main-status">
                                                Exchange Status:{" "}
                                                <strong>
                                                    {exchangeStatus.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </strong>
                                            </p>
                                        )}

                                        {canCancel &&
                                            !itemCancelled && (
                                                <div className="order-item-cancel-action">
                                                    <button
                                                        type="button"
                                                        className="cancel-item-button"
                                                        onClick={() =>
                                                            openCancelItemConfirmation(
                                                                item._id
                                                            )
                                                        }
                                                        disabled={
                                                            cancellingItemId ===
                                                            item._id
                                                        }
                                                    >
                                                        {cancellingItemId ===
                                                        item._id
                                                            ? "Cancelling..."
                                                            : "Cancel Product"}
                                                    </button>
                                                </div>
                                            )}

                                        {canReturnOrExchange &&
                                            !itemCancelled && (
                                                <div className="order-item-actions">
                                                    {!returnRequested &&
                                                        !exchangeRequested && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="return-button"
                                                                    onClick={() =>
                                                                        openReturnConfirmation(
                                                                            item._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        returningItemId ===
                                                                        item._id
                                                                    }
                                                                >
                                                                    {returningItemId ===
                                                                    item._id
                                                                        ? "Requesting..."
                                                                        : "Return"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="exchange-button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/exchange/${id}/${item._id}`
                                                                        )
                                                                    }
                                                                >
                                                                    Exchange
                                                                </button>
                                                            </>
                                                        )}
                                                </div>
                                            )}

                                        {returnStatus ===
                                            "return_requested" && (
                                            <div className="return-status-message return-requested">
                                                Return Request Submitted
                                            </div>
                                        )}

                                        {returnStatus ===
                                            "return_approved" && (
                                            <div className="return-status-message return-approved">
                                                Return Approved
                                            </div>
                                        )}

                                        {returnStatus ===
                                            "return_rejected" && (
                                            <div className="return-status-message return-rejected">
                                                Return Request Rejected
                                            </div>
                                        )}

                                        {returnStatus === "returned" && (
                                            <div className="return-status-message return-completed">
                                                Product Returned
                                            </div>
                                        )}
                                    </div>

                                    {exchangeRequested && (
                                        <>
                                            <div className="customer-exchange-section">
                                                <div className="customer-exchange-header">
                                                    <h3>
                                                        Exchange Details
                                                    </h3>

                                                    <span
                                                        className={`exchange-status-badge ${exchangeStatus}`}
                                                    >
                                                        {exchangeStatus ===
                                                            "exchange_requested" &&
                                                            "Exchange Requested"}

                                                        {exchangeStatus ===
                                                            "exchange_approved" &&
                                                            "Exchange Confirmed"}

                                                        {exchangeStatus ===
                                                            "exchange_rejected" &&
                                                            "Exchange Rejected"}

                                                        {exchangeStatus ===
                                                            "exchanged" &&
                                                            "Exchange Delivered"}
                                                    </span>
                                                </div>

                                                {exchangeStatus ===
                                                "exchange_rejected" ? (
                                                    <div className="exchange-rejected-box">
                                                        <strong>
                                                            Exchange Request
                                                            Rejected
                                                        </strong>

                                                        <span>
                                                            Your exchange
                                                            request was not
                                                            approved.
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="exchange-product-card">
                                                            <div className="exchange-product-image">
                                                                <img
                                                                    src={
                                                                        replacementProductImage
                                                                    }
                                                                    alt={
                                                                        replacementProductName
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="exchange-product-info">
                                                                <span className="replacement-label">
                                                                    Replacement
                                                                    Product
                                                                </span>

                                                                <h3>
                                                                    {
                                                                        replacementProductName
                                                                    }
                                                                </h3>

                                                                {replacementProductPrice !==
                                                                    null && (
                                                                    <p>
                                                                        Price:
                                                                        ₹
                                                                        {
                                                                            replacementProductPrice
                                                                        }
                                                                    </p>
                                                                )}

                                                                <p>
                                                                    Reason:{" "}
                                                                    <strong>
                                                                        {exchangeRequest.reason ||
                                                                            "No reason provided"}
                                                                    </strong>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="exchange-tracking">
                                                            <div className="exchange-tracking-header">
                                                                <h4>
                                                                    Exchange
                                                                    Tracking
                                                                </h4>
                                                            </div>

                                                            <div className="exchange-timeline">
                                                                <div
                                                                    className={`exchange-step ${
                                                                        exchangeStatus ===
                                                                            "exchange_requested" ||
                                                                        exchangeIsConfirmed ||
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="exchange-step-icon">
                                                                        {exchangeStatus ===
                                                                            "exchange_requested" ||
                                                                        exchangeIsConfirmed ||
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "✓"
                                                                            : "1"}
                                                                    </div>

                                                                    <div className="exchange-step-content">
                                                                        <strong>
                                                                            Exchange
                                                                            Requested
                                                                        </strong>

                                                                        <span>
                                                                            Your
                                                                            exchange
                                                                            request
                                                                            has
                                                                            been
                                                                            submitted
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className={`exchange-line ${
                                                                        exchangeIsConfirmed ||
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                />

                                                                <div
                                                                    className={`exchange-step ${
                                                                        exchangeIsConfirmed ||
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="exchange-step-icon">
                                                                        {exchangeIsConfirmed ||
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "✓"
                                                                            : "2"}
                                                                    </div>

                                                                    <div className="exchange-step-content">
                                                                        <strong>
                                                                            Exchange
                                                                            Confirmed
                                                                        </strong>

                                                                        <span>
                                                                            {exchangeIsConfirmed ||
                                                                            replacementIsShipped ||
                                                                            replacementIsDelivered
                                                                                ? "Exchange request approved"
                                                                                : "Waiting for admin approval"}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className={`exchange-line ${
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                />

                                                                <div
                                                                    className={`exchange-step ${
                                                                        replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="exchange-step-icon">
                                                                        {replacementIsShipped ||
                                                                        replacementIsDelivered
                                                                            ? "✓"
                                                                            : "3"}
                                                                    </div>

                                                                    <div className="exchange-step-content">
                                                                        <strong>
                                                                            Replacement
                                                                            Shipped
                                                                        </strong>

                                                                        <span>
                                                                            {replacementIsShipped ||
                                                                            replacementIsDelivered
                                                                                ? "Replacement product has been shipped"
                                                                                : "Waiting for replacement shipment"}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className={`exchange-line ${
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                />

                                                                <div
                                                                    className={`exchange-step ${
                                                                        replacementIsDelivered
                                                                            ? "completed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="exchange-step-icon">
                                                                        {replacementIsDelivered
                                                                            ? "✓"
                                                                            : "4"}
                                                                    </div>

                                                                    <div className="exchange-step-content">
                                                                        <strong>
                                                                            Replacement
                                                                            Delivered
                                                                        </strong>

                                                                        <span>
                                                                            {replacementIsDelivered
                                                                                ? "Exchange completed successfully"
                                                                                : "Waiting for replacement delivery"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="order-details-section">
                    <h2>Delivery Information</h2>

                    <p className="delivery-address">
                        {order.shippingAddress}
                    </p>
                </div>

                <div className="order-details-summary">
                    <div>
                        <span>Total Items</span>

                        <strong>
                            {order.items?.reduce(
                                (total, item) => {
                                    if (
                                        item.cancelStatus ===
                                        "cancelled"
                                    ) {
                                        return total;
                                    }

                                    return (
                                        total +
                                        Number(
                                            item.quantity || 0
                                        )
                                    );
                                },
                                0
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Payment Method</span>

                        <strong>
                            {order.paymentMethod ||
                                "Not available"}
                        </strong>
                    </div>

                    <div>
                        <span>Grand Total</span>

                        <strong>
                            ₹{order.totalAmount}
                        </strong>
                    </div>
                </div>

                {error && (
                    <div className="order-details-error">
                        {error}
                    </div>
                )}

                <div className="order-details-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                    >
                        Back to Orders
                    </button>

                    {canCancel && (
                        <button
                            type="button"
                            onClick={openCancelOrderConfirmation}
                            disabled={cancelling}
                        >
                            {cancelling
                                ? "Cancelling..."
                                : "Cancel Entire Order"}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>

            {confirmPopup.show && (
                <div
                    className="confirm-popup-overlay"
                    onClick={closeConfirmPopup}
                >
                    <div
                        className="confirm-popup"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="confirm-popup-icon">
                            !
                        </div>

                        <h2>{confirmPopup.title}</h2>

                        <p>{confirmPopup.message}</p>

                        <div className="confirm-popup-actions">
                            <button
                                type="button"
                                className="confirm-popup-cancel"
                                onClick={closeConfirmPopup}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-popup-confirm"
                                onClick={handleConfirmAction}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {successPopup.show && (
                <div
                    className="success-popup-overlay"
                    onClick={closeSuccessPopup}
                >
                    <div
                        className="success-popup"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="success-popup-icon">
                            ✓
                        </div>

                        <h2>{successPopup.title}</h2>

                        <p>{successPopup.message}</p>

                        <button
                            type="button"
                            className="success-popup-button"
                            onClick={closeSuccessPopup}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderDetails;