import { useNavigate } from "react-router-dom";
import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
    const navigate = useNavigate();

    return (
        <div className="order-card">
            <div className="order-card-header">
                <div>
                    <h2>Order #{order._id}</h2>

                    <p>
                        Ordered on:{" "}
                        {new Date(
                            order.createdAt
                        ).toLocaleDateString()}
                    </p>
                </div>

                <OrderStatus status={order.status} />
            </div>

            <div className="order-card-content">
                <div>
                    <strong>Items</strong>

                    <p>
                        {order.items?.length || 0}{" "}
                        product
                        {(order.items?.length || 0) !== 1
                            ? "s"
                            : ""}
                    </p>
                </div>

                <div>
                    <strong>Total Amount</strong>

                    <p>
                        ₹{order.totalAmount}
                    </p>
                </div>

                <div>
                    <strong>Payment</strong>

                    <p>
                        {order.paymentMethod ||
                            "Not available"}
                    </p>
                </div>
            </div>

            <div className="order-card-footer">
                <button
                    onClick={() =>
                        navigate(`/orders/${order._id}`)
                    }
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default OrderCard;