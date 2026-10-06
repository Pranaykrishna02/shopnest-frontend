function OrderStatus({ status }) {
    const statusConfig = {
        pending: {
            label: "Pending",
            className: "pending"
        },

        confirmed: {
            label: "Confirmed",
            className: "confirmed"
        },

        shipped: {
            label: "Shipped",
            className: "shipped"
        },

        delivered: {
            label: "Delivered",
            className: "delivered"
        },

        cancelled: {
            label: "Cancelled",
            className: "cancelled"
        }
    };

    const currentStatus =
        statusConfig[status] || {
            label: status || "Unknown",
            className: "unknown"
        };

    return (
        <span
            className={`order-status ${currentStatus.className}`}
        >
            {currentStatus.label}
        </span>
    );
}

export default OrderStatus;