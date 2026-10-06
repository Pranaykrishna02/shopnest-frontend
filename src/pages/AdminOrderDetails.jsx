import { useEffect, useState } from "react";

import {Link,useParams} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;


function AdminOrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [updating, setUpdating] =
        useState(false);

    const [selectedStatus, setSelectedStatus] =
        useState("");

    const [
        exchangeUpdatingItemId,
        setExchangeUpdatingItemId
    ] = useState(null);


    // ======================================================
    // ORDER STATUSES
    // ======================================================

    const statuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"
    ];


    // ======================================================
    // FETCH ORDER
    // ======================================================

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);

                setError("");

                const token =
                    localStorage.getItem("token");


                // ==================================================
                // GET ORDER
                // ==================================================

                const response = await fetch(
                    `${API_URL}/order/admin/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
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
                        "Failed to fetch order"
                    );

                }


                setOrder(result.data);

                setSelectedStatus(
                    result.data.status
                );


                // ==================================================
                // GET PRODUCTS
                // ==================================================

                try {

                    const productResponse =
                        await fetch(
                            `${API_URL}/product/list`
                        );


                    const productResult =
                        await productResponse.json();


                    if (
                        productResponse.ok &&
                        productResult.status
                    ) {

                        setProducts(
                            productResult.data || []
                        );

                    }

                } catch (productError) {

                    console.log(
                        "Product image lookup failed:",
                        productError.message
                    );

                }


            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setLoading(false);

            }

        };


        fetchOrder();

    }, [id]);


    // ======================================================
    // UPDATE ORDER STATUS
    // ======================================================

    const handleStatusUpdate = async () => {

        if (
            !selectedStatus ||
            selectedStatus === order.status
        ) {
            return;
        }


        try {

            setUpdating(true);

            setError("");


            const response = await fetch(
                `${API_URL}/order/${id}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${localStorage.getItem(
                                "token"
                            )}`
                    },

                    body: JSON.stringify({
                        status:
                            selectedStatus
                    })
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
                    "Failed to update order status"
                );

            }


            setOrder(result.data);

            setSelectedStatus(
                result.data.status
            );


        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setUpdating(false);

        }

    };


    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDateTime = (date) => {

        if (!date) {
            return "N/A";
        }


        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ======================================================
    // FORMAT AMOUNT
    // ======================================================

    const formatAmount = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString("en-IN");

    };


    // ======================================================
    // GET PRODUCT NAME
    // ======================================================

    const getProductName = (item) => {

        if (!item) {
            return "Product";
        }


        if (
            item.name &&
            typeof item.name === "object"
        ) {

            return (
                item.name.name ||
                "Product"
            );

        }


        if (
            item.name &&
            typeof item.name === "string"
        ) {

            return item.name;

        }


        if (
            item.productId &&
            typeof item.productId === "object"
        ) {

            return (
                item.productId.name ||
                "Product"
            );

        }


        return "Product";

    };


    // ======================================================
    // GET PRODUCT IMAGE
    // ======================================================

    const getProductImage = (productData) => {

        if (!productData) {
            return "";
        }


        // ==================================================
        // IF PRODUCT IS AN OBJECT
        // ==================================================

        if (
            typeof productData === "object"
        ) {

            const directImage =
                productData.image ||
                productData.imageUrl ||
                productData.productImage ||
                "";


            if (
                typeof directImage === "string" &&
                directImage.trim() !== ""
            ) {

                return directImage.trim();

            }


            // ==============================================
            // FIND PRODUCT FROM PRODUCT LIST
            // ==============================================

            const productId =
                productData._id ||
                productData.id;


            if (productId) {

                const matchingProduct =
                    products.find(
                        (product) =>
                            String(product._id) ===
                            String(productId)
                    );


                if (matchingProduct) {

                    return (
                        matchingProduct.image ||
                        matchingProduct.imageUrl ||
                        matchingProduct.productImage ||
                        ""
                    );

                }

            }

        }


        // ==================================================
        // IF PRODUCT IS JUST AN ID
        // ==================================================

        if (
            typeof productData === "string"
        ) {

            const matchingProduct =
                products.find(
                    (product) =>
                        String(product._id) ===
                        String(productData)
                );


            if (matchingProduct) {

                return (
                    matchingProduct.image ||
                    matchingProduct.imageUrl ||
                    matchingProduct.productImage ||
                    ""
                );

            }

        }


        return "";

    };


    // ======================================================
    // GET REPLACEMENT PRODUCT
    // ======================================================

    const getReplacementProduct = (item) => {

        return (
            item?.exchangeRequest
                ?.replacementProductId ||
            null
        );

    };


    // ======================================================
    // GET REPLACEMENT PRODUCT NAME
    // ======================================================

    const getReplacementProductName = (item) => {

        const replacementProduct =
            getReplacementProduct(item);


        if (
            replacementProduct &&
            typeof replacementProduct ===
                "object"
        ) {

            return (
                replacementProduct.name ||
                item.exchangeRequest
                    ?.replacementProductName ||
                "Replacement Product"
            );

        }


        return (
            item.exchangeRequest
                ?.replacementProductName ||
            "Replacement Product"
        );

    };


    // ======================================================
    // GET REPLACEMENT PRODUCT PRICE
    // ======================================================

    const getReplacementProductPrice = (item) => {

        const replacementProduct =
            getReplacementProduct(item);


        if (
            replacementProduct &&
            typeof replacementProduct ===
                "object" &&
            replacementProduct.price !==
                undefined
        ) {

            return replacementProduct.price;

        }


        const replacementProductId =
            typeof replacementProduct ===
                "string"
                ? replacementProduct
                : replacementProduct?._id;


        if (replacementProductId) {

            const matchingProduct =
                products.find(
                    (product) =>
                        String(product._id) ===
                        String(replacementProductId)
                );


            if (matchingProduct) {

                return matchingProduct.price;

            }

        }


        return null;

    };


    // ======================================================
    // APPROVE EXCHANGE
    // ======================================================

    const handleApproveExchange =
        async (itemId) => {

            try {

                setExchangeUpdatingItemId(
                    itemId
                );

                setError("");


                const response = await fetch(
                    `${API_URL}/order/${id}/item/${itemId}/exchange/approve`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
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
                        "Failed to approve exchange request"
                    );

                }


                setOrder(result.data);


            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setExchangeUpdatingItemId(
                    null
                );

            }

        };


    // ======================================================
    // REJECT EXCHANGE
    // ======================================================

    const handleRejectExchange =
        async (itemId) => {

            try {

                setExchangeUpdatingItemId(
                    itemId
                );

                setError("");


                const response = await fetch(
                    `${API_URL}/order/${id}/item/${itemId}/exchange/reject`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
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
                        "Failed to reject exchange request"
                    );

                }


                setOrder(result.data);


            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setExchangeUpdatingItemId(
                    null
                );

            }

        };


    // ======================================================
    // START EXCHANGE PROCESSING
    // ======================================================

    const handleProcessExchange =
        async (itemId) => {

            try {

                setExchangeUpdatingItemId(
                    itemId
                );

                setError("");


                const response = await fetch(
                    `${API_URL}/order/${id}/item/${itemId}/exchange/process`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
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
                        "Failed to start exchange processing"
                    );

                }


                setOrder(result.data);


            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setExchangeUpdatingItemId(
                    null
                );

            }

        };


    // ======================================================
    // SHIP EXCHANGE
    // ======================================================

    const handleShipExchange =
        async (itemId) => {

            try {

                setExchangeUpdatingItemId(
                    itemId
                );

                setError("");


                const response = await fetch(
                    `${API_URL}/order/${id}/item/${itemId}/exchange/ship`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
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
                        "Failed to ship exchange product"
                    );

                }


                setOrder(result.data);


            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setExchangeUpdatingItemId(
                    null
                );

            }

        };


    // ======================================================
    // DELIVER EXCHANGE
    // ======================================================

    const handleDeliverExchange =
        async (itemId) => {

            try {

                setExchangeUpdatingItemId(
                    itemId
                );

                setError("");


                const response = await fetch(
                    `${API_URL}/order/${id}/item/${itemId}/exchange/deliver`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem(
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
                        "Failed to mark exchange as delivered"
                    );

                }


                setOrder(result.data);


            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setExchangeUpdatingItemId(
                    null
                );

            }

        };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div className="exact-admin-page">

                <div className="exact-admin-loading">

                    Loading order details...

                </div>

            </div>

        );

    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error && !order) {

        return (

            <div className="exact-admin-page">

                <div className="exact-admin-error">

                    {error}

                </div>


                <Link
                    to="/admin/orders"
                    className="exact-admin-primary-button"
                >

                    Back to Orders

                </Link>

            </div>

        );

    }


    // ======================================================
    // ORDER NOT FOUND
    // ======================================================

    if (!order) {

        return (

            <div className="exact-admin-page">

                <div className="exact-admin-empty-panel">

                    <h2>
                        Order Not Found
                    </h2>


                    <Link
                        to="/admin/orders"
                        className="exact-admin-primary-button"
                    >

                        Back to Orders

                    </Link>

                </div>

            </div>

        );

    }


    // ======================================================
    // MAIN PAGE
    // ======================================================

    return (

        <div className="exact-admin-page exact-admin-details-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="exact-admin-orders-heading">

                <div>

                    <h1>
                        Order Details
                    </h1>

                    <p>
                        Manage and view order information.
                    </p>

                </div>


                <Link
                    to="/admin/orders"
                    className="exact-admin-back-button"
                >

                    ← Back to Orders

                </Link>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="exact-admin-error">

                    {error}

                </div>

            )}


            {/* ==================================================
                DETAILS GRID
            ================================================== */}

            <div className="exact-admin-details-grid">


                {/* ==================================================
                    ORDER INFORMATION
                ================================================== */}

                <section className="exact-admin-detail-card">

                    <div className="exact-admin-detail-card-header">

                        <h2>
                            Order Information
                        </h2>

                    </div>


                    <div className="exact-admin-detail-info">


                        <div>

                            <span>
                                Order ID
                            </span>

                            <strong>
                                #{order._id.slice(-8)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Order Date
                            </span>

                            <strong>
                                {formatDateTime(
                                    order.createdAt
                                )}
                            </strong>

                        </div>


                        <div className="exact-admin-status-update">

                            <span>
                                Status
                            </span>


                            <div className="exact-admin-status-control">

                                <select
                                    value={
                                        selectedStatus
                                    }
                                    onChange={(event) =>
                                        setSelectedStatus(
                                            event.target.value
                                        )
                                    }
                                    disabled={updating}
                                >

                                    {statuses.map(
                                        (status) => (

                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>

                                        )
                                    )}

                                </select>


                                <button
                                    type="button"
                                    onClick={
                                        handleStatusUpdate
                                    }
                                    disabled={
                                        updating ||
                                        selectedStatus ===
                                            order.status
                                    }
                                >

                                    {updating
                                        ? "Updating..."
                                        : "Update Status"}

                                </button>

                            </div>

                        </div>


                        <div>

                            <span>
                                Total Amount
                            </span>

                            <strong>

                                ₹
                                {formatAmount(
                                    order.totalAmount
                                )}

                            </strong>

                        </div>


                        <div>

                            <span>
                                Payment Method
                            </span>

                            <strong>

                                {order.paymentMethod ||
                                    "Not available"}

                            </strong>

                        </div>


                    </div>

                </section>


                {/* ==================================================
                    CUSTOMER INFORMATION
                ================================================== */}

                <section className="exact-admin-detail-card">

                    <div className="exact-admin-detail-card-header">

                        <h2>
                            Customer Information
                        </h2>

                    </div>


                    <div className="exact-admin-person">

                        <div className="exact-admin-large-avatar">

                            {(
                                order.userId?.name ||
                                "U"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div>

                            <strong>

                                {order.userId?.name ||
                                    "Not available"}

                            </strong>


                            <span>

                                {order.userId?.email ||
                                    "Not available"}

                            </span>


                            {order.userId?.phone && (

                                <span>
                                    {order.userId.phone}
                                </span>

                            )}

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    SHIPPING ADDRESS
                ================================================== */}

                <section className="exact-admin-detail-card">

                    <div className="exact-admin-detail-card-header">

                        <h2>
                            Shipping Address
                        </h2>

                    </div>


                    <div className="exact-admin-address">

                        <div className="exact-admin-address-icon">
                            ●
                        </div>


                        <p>

                            {order.shippingAddress ||
                                "Not available"}

                        </p>

                    </div>

                </section>


            </div>


            {/* ==================================================
                ORDER ITEMS
            ================================================== */}

            <section className="exact-admin-detail-card exact-admin-items-card">


                <div className="exact-admin-detail-card-header">

                    <h2>
                        Order Items
                    </h2>

                </div>


                <div className="exact-admin-items-table-wrap">

                    <table className="exact-admin-items-table">

                        <thead>

                            <tr>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Quantity
                                </th>

                                <th>
                                    Total
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {order.items?.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            item._id ||
                                            index
                                        }
                                    >

                                        <td>

                                            <div className="exact-admin-product-cell">

                                                <div className="exact-admin-product-placeholder">

                                                    {getProductImage(
                                                        item.productId
                                                    ) ? (

                                                        <img
                                                            src={
                                                                getProductImage(
                                                                    item.productId
                                                                )
                                                            }
                                                            alt={
                                                                getProductName(
                                                                    item
                                                                )
                                                            }
                                                            className="exact-admin-product-image"
                                                            onError={(event) => {
                                                                event.currentTarget.style.display =
                                                                    "none";

                                                                event.currentTarget.parentElement
                                                                    ?.querySelector(
                                                                        ".admin-product-image-fallback"
                                                                    )
                                                                    ?.classList.add(
                                                                        "show"
                                                                    );
                                                            }}
                                                        />

                                                    ) : null}


                                                    <span className="admin-product-image-fallback">

                                                        🛍

                                                    </span>

                                                </div>


                                                <div>

                                                    <strong>

                                                        {getProductName(
                                                            item
                                                        )}

                                                    </strong>


                                                    <span>
                                                        Original Product
                                                    </span>


                                                    {item.cancelStatus ===
                                                        "cancelled" && (

                                                        <span className="admin-item-cancelled">

                                                            Cancelled

                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                        </td>


                                        <td>

                                            ₹
                                            {formatAmount(
                                                item.price
                                            )}

                                        </td>


                                        <td>

                                            {item.quantity}

                                        </td>


                                        <td>

                                            ₹
                                            {formatAmount(
                                                item.total
                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>


                        <tfoot>

                            <tr>

                                <td colSpan="3">
                                    Total Amount
                                </td>


                                <td>

                                    ₹
                                    {formatAmount(
                                        order.totalAmount
                                    )}

                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>


                {/* ==================================================
                    EXCHANGE REQUESTS
                ================================================== */}

                {order.items?.some(
                    (item) =>
                        item.exchangeStatus !==
                        "normal"
                ) && (

                    <div className="admin-exchange-section">


                        {/* ==================================================
                            EXCHANGE SECTION HEADER
                        ================================================== */}

                        <div className="admin-exchange-section-header">

                            <div>

                                <span className="admin-exchange-eyebrow">

                                    CUSTOMER REQUEST

                                </span>


                                <h2>
                                    Exchange Requests
                                </h2>


                                <p>
                                    Review the requested replacement
                                    product and customer's reason.
                                </p>

                            </div>

                        </div>


                        {/* ==================================================
                            EXCHANGE REQUEST LIST
                        ================================================== */}

                        <div className="admin-exchange-list">

                            {order.items

                                ?.filter(
                                    (item) =>
                                        item.exchangeStatus !==
                                        "normal"
                                )

                                .map(
                                    (item) => {

                                        const replacementProduct =
                                            getReplacementProduct(
                                                item
                                            );


                                        const replacementProductName =
                                            getReplacementProductName(
                                                item
                                            );


                                        const replacementImage =
                                            getProductImage(
                                                replacementProduct
                                            );


                                        const replacementPrice =
                                            getReplacementProductPrice(
                                                item
                                            );


                                        const exchangeStatus =
                                            item.exchangeStatus;


                                        const exchangeDeliveryStatus =
                                            item.exchangeDeliveryStatus ||
                                            "not_started";


                                        return (

                                            <div
                                                className="admin-exchange-card"
                                                key={
                                                    `exchange-${item._id}`
                                                }
                                            >


                                                {/* ==================================================
                                                    EXCHANGE HEADER
                                                ================================================== */}

                                                <div className="admin-exchange-card-top">

                                                    <div>

                                                        <span className="admin-exchange-request-label">

                                                            Exchange Request

                                                        </span>


                                                        <h3>

                                                            {getProductName(
                                                                item
                                                            )}

                                                        </h3>

                                                    </div>


                                                    <span
                                                        className={
                                                            `admin-exchange-status admin-exchange-status-${exchangeStatus.replace(
                                                                /_/g,
                                                                "-"
                                                            )}`
                                                        }
                                                    >

                                                        {exchangeStatus.replace(
                                                            /_/g,
                                                            " "
                                                        )}

                                                    </span>

                                                </div>


                                                {/* ==================================================
                                                    ORIGINAL + REPLACEMENT
                                                ================================================== */}

                                                <div className="admin-exchange-products">


                                                    {/* ORIGINAL PRODUCT */}

                                                    <div className="admin-exchange-product-box">

                                                        <span className="admin-exchange-product-label">

                                                            Original Product

                                                        </span>


                                                        <div className="admin-exchange-product-content">

                                                            <div className="admin-exchange-product-image">

                                                                {getProductImage(
                                                                    item.productId
                                                                ) ? (

                                                                    <img
                                                                        src={
                                                                            getProductImage(
                                                                                item.productId
                                                                            )
                                                                        }
                                                                        alt={
                                                                            getProductName(
                                                                                item
                                                                            )
                                                                        }
                                                                        onError={(event) => {

                                                                            event.currentTarget.style.display =
                                                                                "none";

                                                                            event.currentTarget.parentElement
                                                                                ?.querySelector(
                                                                                    ".exchange-image-fallback"
                                                                                )
                                                                                ?.classList.add(
                                                                                    "show"
                                                                                );

                                                                        }}
                                                                    />

                                                                ) : null}


                                                                <span className="exchange-image-fallback">

                                                                    🛍

                                                                </span>

                                                            </div>


                                                            <div>

                                                                <strong>

                                                                    {getProductName(
                                                                        item
                                                                    )}

                                                                </strong>


                                                                <span>

                                                                    ₹
                                                                    {formatAmount(
                                                                        item.price
                                                                    )}

                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {/* ARROW */}

                                                    <div className="admin-exchange-arrow">

                                                        →

                                                    </div>


                                                    {/* REPLACEMENT PRODUCT */}

                                                    <div className="admin-exchange-product-box admin-exchange-replacement-box">

                                                        <span className="admin-exchange-product-label">

                                                            Requested Replacement

                                                        </span>


                                                        <div className="admin-exchange-product-content">

                                                            <div className="admin-exchange-product-image">

                                                                {replacementImage ? (

                                                                    <img
                                                                        src={
                                                                            replacementImage
                                                                        }
                                                                        alt={
                                                                            replacementProductName
                                                                        }
                                                                        onError={(event) => {

                                                                            event.currentTarget.style.display =
                                                                                "none";

                                                                            event.currentTarget.parentElement
                                                                                ?.querySelector(
                                                                                    ".exchange-image-fallback"
                                                                                )
                                                                                ?.classList.add(
                                                                                    "show"
                                                                                );

                                                                        }}
                                                                    />

                                                                ) : null}


                                                                <span className="exchange-image-fallback">

                                                                    🔄

                                                                </span>

                                                            </div>


                                                            <div>

                                                                <strong>

                                                                    {
                                                                        replacementProductName
                                                                    }

                                                                </strong>


                                                                {replacementPrice !==
                                                                    null && (

                                                                    <span>

                                                                        ₹
                                                                        {formatAmount(
                                                                            replacementPrice
                                                                        )}

                                                                    </span>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>


                                                </div>


                                                {/* ==================================================
                                                    CUSTOMER REASON
                                                ================================================== */}

                                                <div className="admin-exchange-reason">

                                                    <span>
                                                        Customer Reason
                                                    </span>


                                                    <p>

                                                        {item.exchangeRequest?.reason ||
                                                            "No reason provided"}

                                                    </p>

                                                </div>


                                                {/* ==================================================
                                                    REQUEST DATE
                                                ================================================== */}

                                                <div className="admin-exchange-request-date">

                                                    <span>
                                                        Requested On
                                                    </span>


                                                    <strong>

                                                        {formatDateTime(
                                                            item.exchangeRequest
                                                                ?.requestedAt
                                                        )}

                                                    </strong>

                                                </div>


                                                {/* ==================================================
                                                    APPROVE / REJECT
                                                ================================================== */}

                                                {exchangeStatus ===
                                                    "exchange_requested" && (

                                                    <div className="admin-exchange-actions">


                                                        <button
                                                            type="button"
                                                            className="admin-exchange-approve-button"
                                                            onClick={() =>
                                                                handleApproveExchange(
                                                                    item._id
                                                                )
                                                            }
                                                            disabled={
                                                                exchangeUpdatingItemId ===
                                                                item._id
                                                            }
                                                        >

                                                            {exchangeUpdatingItemId ===
                                                            item._id
                                                                ? "Processing..."
                                                                : "✓ Approve Exchange"}

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="admin-exchange-reject-button"
                                                            onClick={() =>
                                                                handleRejectExchange(
                                                                    item._id
                                                                )
                                                            }
                                                            disabled={
                                                                exchangeUpdatingItemId ===
                                                                item._id
                                                            }
                                                        >

                                                            {exchangeUpdatingItemId ===
                                                            item._id
                                                                ? "Processing..."
                                                                : "✕ Reject Exchange"}

                                                        </button>

                                                    </div>

                                                )}


                                                {/* ==================================================
                                                    APPROVED + DELIVERY PROCESS
                                                ================================================== */}

                                                {exchangeStatus ===
                                                    "exchange_approved" && (

                                                    <div className="admin-exchange-delivery-panel">


                                                        <div className="admin-exchange-delivery-status">

                                                            <span>
                                                                Exchange Approved
                                                            </span>


                                                            <strong>

                                                                {exchangeDeliveryStatus ===
                                                                    "not_started" &&
                                                                    "Ready to Process"}

                                                                {exchangeDeliveryStatus ===
                                                                    "processing" &&
                                                                    "Processing"}

                                                                {exchangeDeliveryStatus ===
                                                                    "shipped" &&
                                                                    "Shipped"}

                                                                {exchangeDeliveryStatus ===
                                                                    "delivered" &&
                                                                    "Delivered"}

                                                            </strong>

                                                        </div>


                                                        {exchangeDeliveryStatus ===
                                                            "not_started" && (

                                                            <button
                                                                type="button"
                                                                className="admin-exchange-process-button"
                                                                onClick={() =>
                                                                    handleProcessExchange(
                                                                        item._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    exchangeUpdatingItemId ===
                                                                    item._id
                                                                }
                                                            >

                                                                {exchangeUpdatingItemId ===
                                                                item._id
                                                                    ? "Processing..."
                                                                    : "Start Processing"}

                                                            </button>

                                                        )}


                                                        {exchangeDeliveryStatus ===
                                                            "processing" && (

                                                            <button
                                                                type="button"
                                                                className="admin-exchange-ship-button"
                                                                onClick={() =>
                                                                    handleShipExchange(
                                                                        item._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    exchangeUpdatingItemId ===
                                                                    item._id
                                                                }
                                                            >

                                                                {exchangeUpdatingItemId ===
                                                                item._id
                                                                    ? "Processing..."
                                                                    : "🚚 Mark as Shipped"}

                                                            </button>

                                                        )}


                                                        {exchangeDeliveryStatus ===
                                                            "shipped" && (

                                                            <button
                                                                type="button"
                                                                className="admin-exchange-deliver-button"
                                                                onClick={() =>
                                                                    handleDeliverExchange(
                                                                        item._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    exchangeUpdatingItemId ===
                                                                    item._id
                                                                }
                                                            >

                                                                {exchangeUpdatingItemId ===
                                                                item._id
                                                                    ? "Processing..."
                                                                    : "✓ Mark as Delivered"}

                                                            </button>

                                                        )}


                                                        {exchangeDeliveryStatus ===
                                                            "delivered" && (

                                                            <div className="admin-exchange-completed-message">

                                                                ✓ Replacement product has been delivered.

                                                            </div>

                                                        )}

                                                    </div>

                                                )}


                                                {/* ==================================================
                                                    REJECTED
                                                ================================================== */}

                                                {exchangeStatus ===
                                                    "exchange_rejected" && (

                                                    <div className="admin-exchange-rejected-message">

                                                        Exchange request has been rejected.

                                                    </div>

                                                )}


                                                {/* ==================================================
                                                    COMPLETED
                                                ================================================== */}

                                                {exchangeStatus ===
                                                    "exchanged" && (

                                                    <div className="admin-exchange-completed-message">

                                                        ✓ Product exchange has been completed.

                                                    </div>

                                                )}


                                            </div>

                                        );

                                    }

                                )}

                        </div>

                    </div>

                )}


            </section>


        </div>

    );

}


export default AdminOrderDetails;