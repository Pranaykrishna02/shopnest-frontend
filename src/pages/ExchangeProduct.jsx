import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function ExchangeProduct() {
    const { orderId, itemId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);

    const [selectedProductId, setSelectedProductId] =
        useState("");

    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                // ==========================================
                // GET ORDER
                // ==========================================

                const orderResponse = await fetch(
                    `${API_URL}/order/${orderId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const orderResult =
                    await orderResponse.json();

                if (
                    !orderResponse.ok ||
                    !orderResult.status
                ) {
                    throw new Error(
                        orderResult.message ||
                            "Failed to fetch order"
                    );
                }

                setOrder(orderResult.data);

                // ==========================================
                // GET PRODUCTS
                // ==========================================

                const productResponse =
                    await fetch(
                        `${API_URL}/product/list`
                    );

                const productResult =
                    await productResponse.json();

                if (
                    !productResponse.ok ||
                    !productResult.status
                ) {
                    throw new Error(
                        productResult.message ||
                            "Failed to fetch products"
                    );
                }

                setProducts(
                    productResult.data || []
                );

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    // ==========================================
    // FIND ORIGINAL ORDER ITEM
    // ==========================================

    const originalItem =
        order?.items?.find(
            (item) =>
                item._id === itemId
        );

    // ==========================================
    // FILTER REPLACEMENT PRODUCTS
    // ==========================================

    const replacementProducts =
        products.filter((product) => {

            const originalProductId =
                originalItem?.productId?._id ||
                originalItem?.productId;

            const currentProductId =
                product._id;

            return (
                currentProductId !==
                    originalProductId &&
                product.status === "active" &&
                Number(product.stock || 0) > 0
            );
        });

    // ==========================================
    // SUBMIT EXCHANGE REQUEST
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!selectedProductId) {
            setError(
                "Please select a replacement product."
            );
            return;
        }

        if (!reason.trim()) {
            setError(
                "Please enter the reason for exchange."
            );
            return;
        }

        if (reason.trim().length < 5) {
            setError(
                "Please provide a little more detail about the reason."
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(
                `${API_URL}/order/${orderId}/item/${itemId}/exchange`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`,

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        replacementProductId:
                            selectedProductId,

                        reason:
                            reason.trim()
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
                        "Failed to submit exchange request"
                );
            }

            alert(
                "Exchange request submitted successfully."
            );

            navigate(
                `/orders/${orderId}`
            );

        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="exchange-page">
                <div className="exchange-container">
                    <div className="exchange-loading">
                        Loading exchange products...
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error && !order) {
        return (
            <div className="exchange-page">
                <div className="exchange-container">

                    <div className="exchange-error">
                        {error}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/orders/${orderId}`
                            )
                        }
                    >
                        ← Back to Order
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="exchange-page">

            <div className="exchange-container">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="exchange-header">

                    <button
                        type="button"
                        className="exchange-back-button"
                        onClick={() =>
                            navigate(
                                `/orders/${orderId}`
                            )
                        }
                    >
                        ← Back to Order
                    </button>

                    <h1>
                        Exchange Product
                    </h1>

                    <p>
                        Select a replacement product
                        and tell us why you want to
                        exchange your current product.
                    </p>

                </div>

                {/* ==========================================
                    ORIGINAL PRODUCT
                ========================================== */}

                {originalItem && (
                    <div className="exchange-original-card">

                        <div>
                            <span>
                                Current Product
                            </span>

                            <h2>
                                {originalItem.name}
                            </h2>

                            <p>
                                Quantity:{" "}
                                {originalItem.quantity}
                            </p>
                        </div>

                        <strong>
                            ₹
                            {Number(
                                originalItem.price || 0
                            ).toLocaleString("en-IN")}
                        </strong>

                    </div>
                )}

                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && (
                    <div className="exchange-form-error">
                        {error}
                    </div>
                )}

                {/* ==========================================
                    EXCHANGE FORM
                ========================================== */}

                <form
                    className="exchange-form"
                    onSubmit={handleSubmit}
                >

                    <div className="exchange-section">

                        <div className="exchange-section-heading">

                            <span className="exchange-step">
                                1
                            </span>

                            <div>
                                <h2>
                                    Select Replacement Product
                                </h2>

                                <p>
                                    Choose the product you
                                    want instead.
                                </p>
                            </div>

                        </div>

                        {replacementProducts.length ===
                        0 ? (

                            <div className="exchange-no-products">
                                No replacement products
                                are currently available.
                            </div>

                        ) : (

                            <div className="exchange-products-grid">

                                {replacementProducts.map(
                                    (product) => {

                                        const isSelected =
                                            selectedProductId ===
                                            product._id;

                                        return (
                                            <button
                                                type="button"
                                                key={
                                                    product._id
                                                }
                                                className={
                                                    `exchange-product-card ${
                                                        isSelected
                                                            ? "selected"
                                                            : ""
                                                    }`
                                                }
                                                onClick={() =>
                                                    setSelectedProductId(
                                                        product._id
                                                    )
                                                }
                                            >

                                                <div className="exchange-product-image">

                                                    {product.image ? (
                                                        <img
                                                            src={
                                                                product.image
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                        />
                                                    ) : (
                                                        <span>
                                                            📦
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="exchange-product-info">

                                                    <h3>
                                                        {
                                                            product.name
                                                        }
                                                    </h3>

                                                    <p>
                                                        ₹
                                                        {Number(
                                                            product.price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                    <span>
                                                        {product.stock}{" "}
                                                        available
                                                    </span>

                                                </div>

                                                <div className="exchange-select-indicator">

                                                    {isSelected
                                                        ? "✓"
                                                        : ""}

                                                </div>

                                            </button>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                    {/* ==========================================
                        REASON
                    ========================================== */}

                    <div className="exchange-section">

                        <div className="exchange-section-heading">

                            <span className="exchange-step">
                                2
                            </span>

                            <div>
                                <h2>
                                    Reason for Exchange
                                </h2>

                                <p>
                                    Tell the admin why you
                                    want to exchange this
                                    product.
                                </p>
                            </div>

                        </div>

                        <textarea
                            className="exchange-reason"
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Example: The product is damaged, wrong size, wrong product received..."
                            rows="5"
                            maxLength="500"
                        />

                        <div className="exchange-reason-count">
                            {reason.length}/500
                        </div>

                    </div>

                    {/* ==========================================
                        SUBMIT
                    ========================================== */}

                    <div className="exchange-submit-section">

                        <button
                            type="submit"
                            className="exchange-submit-button"
                            disabled={
                                submitting ||
                                !selectedProductId ||
                                !reason.trim()
                            }
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Exchange Request"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ExchangeProduct;