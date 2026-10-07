import { useNavigate } from "react-router-dom";
import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
    const navigate = useNavigate();

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    return (
        <div className="order-card">

            {/* ================================
                ORDER HEADER
            ================================= */}

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


            {/* ================================
                PRODUCT PREVIEW
            ================================= */}

            {items.length > 0 && (
                <div className="orders-product-preview">

                    {items.map((item, index) => {

                        const product =
                            item.productId &&
                            typeof item.productId === "object"
                                ? item.productId
                                : null;

                        const productImage =
                            product?.image ||
                            product?.imageUrl ||
                            product?.thumbnail ||
                            "";

                        const productName =
                            product?.name ||
                            item.productName ||
                            "Product";

                        const quantity =
                            Number(item.quantity || 1);

                        const price =
                            Number(
                                item.price ||
                                product?.price ||
                                0
                            );

                        return (
                            <div
                                className="orders-product-item"
                                key={
                                    item._id ||
                                    product?._id ||
                                    index
                                }
                            >

                                {/* PRODUCT IMAGE */}

                                <div className="orders-product-image">

                                    {productImage ? (
                                        <img
                                            src={productImage}
                                            alt={productName}
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";

                                                const fallback =
                                                    event.currentTarget
                                                        .nextElementSibling;

                                                if (fallback) {
                                                    fallback.style.display =
                                                        "flex";
                                                }
                                            }}
                                        />
                                    ) : null}

                                    <div
                                        className="orders-product-fallback"
                                        style={{
                                            display: productImage
                                                ? "none"
                                                : "flex"
                                        }}
                                    >
                                        🛍️
                                    </div>

                                </div>


                                {/* PRODUCT INFORMATION */}

                                <div className="orders-product-info">

                                    <h3>
                                        {productName}
                                    </h3>

                                    <p>
                                        Qty:{" "}
                                        <strong>
                                            {quantity}
                                        </strong>
                                    </p>

                                    <p>
                                        ₹
                                        {price.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}


            {/* ================================
                ORDER CONTENT
            ================================= */}

            <div className="order-card-content">

                <div>
                    <strong>Items</strong>

                    <p>
                        {items.length}{" "}
                        product
                        {items.length !== 1
                            ? "s"
                            : ""}
                    </p>
                </div>


                <div>
                    <strong>Total Amount</strong>

                    <p>
                        ₹
                        {Number(
                            order.totalAmount || 0
                        ).toLocaleString("en-IN")}
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


            {/* ================================
                ORDER FOOTER
            ================================= */}

            <div className="order-card-footer">

                <button
                    onClick={() =>
                        navigate(
                            `/orders/${order._id}`
                        )
                    }
                >
                    View Details
                </button>

            </div>

        </div>
    );
}

export default OrderCard;