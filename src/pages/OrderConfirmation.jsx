import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/order/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.status) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch order"
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
    }, [orderId]);

    if (loading) {
        return (
            <div className="order-confirmation-page">
                <div className="order-confirmation-card">
                    <h1>Loading Order...</h1>

                    <p>
                        Please wait while we load your
                        order details.
                    </p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-confirmation-page">
                <div className="order-confirmation-card">
                    <div className="confirmation-error-icon">
                        !
                    </div>

                    <h1>Order Not Found</h1>

                    <p>
                        {error ||
                            "Unable to find this order."}
                    </p>

                    <button
                        className="continue-shopping-button"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-confirmation-page">
            <div className="order-confirmation-card">

                <div className="confirmation-success-icon">
                    ✓
                </div>

                <h1>Order Placed Successfully!</h1>

                <p className="confirmation-message">
                    Thank you for your order.
                    Your order has been successfully
                    created.
                </p>

                <div className="order-confirmation-details">

                    <div className="confirmation-row">
                        <span>Order ID</span>

                        <strong>
                            {order._id}
                        </strong>
                    </div>

                    <div className="confirmation-row">
                        <span>Order Status</span>

                        <strong>
                            {order.status}
                        </strong>
                    </div>

                    <div className="confirmation-row">
                        <span>Payment Method</span>

                        <strong>
                            {order.paymentMethod ||
                                "Cash on Delivery"}
                        </strong>
                    </div>

                    <div className="confirmation-row">
                        <span>Order Total</span>

                        <strong>
                            ₹{order.totalAmount}
                        </strong>
                    </div>

                </div>

                <div className="confirmation-section">

                    <h2>Delivery Information</h2>

                    <p>
                        {order.shippingAddress}
                    </p>

                </div>

                <div className="confirmation-section">

                    <h2>Ordered Items</h2>

                    <div className="confirmation-items">

                        {order.items?.map((item) => (
                            <div
                                className="confirmation-item"
                                key={item._id}
                            >
                                <div>
                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        Quantity:{" "}
                                        {item.quantity}
                                    </p>

                                    <p>
                                        Price: ₹
                                        {item.price}
                                    </p>
                                </div>

                                <strong>
                                    ₹{item.total}
                                </strong>
                            </div>
                        ))}

                    </div>

                </div>

                <button
                    className="continue-shopping-button"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Continue Shopping
                </button>

            </div>

           
        </div>
    );
}

export default OrderConfirmation;