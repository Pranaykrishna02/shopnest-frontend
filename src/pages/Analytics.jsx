import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function Analytics() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/order/list`,
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
                        "Failed to fetch analytics"
                    );
                }

                setOrders(result.data || []);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const totalOrders = orders.length;

    const totalRevenue = orders
        .filter(
            (order) =>
                order.status !== "cancelled"
        )
        .reduce(
            (total, order) =>
                total +
                Number(order.totalAmount || 0),
            0
        );

    const pendingOrders = orders.filter(
        (order) =>
            order.status === "pending"
    ).length;

    const confirmedOrders = orders.filter(
        (order) =>
            order.status === "confirmed"
    ).length;

    const shippedOrders = orders.filter(
        (order) =>
            order.status === "shipped"
    ).length;

    const deliveredOrders = orders.filter(
        (order) =>
            order.status === "delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) =>
            order.status === "cancelled"
    ).length;

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN"
        );
    };

    const getPercentage = (count) => {
        if (totalOrders === 0) {
            return 0;
        }

        return Math.round(
            (count / totalOrders) * 100
        );
    };

    if (loading) {
        return (
            <div className="exact-admin-page">
                <div className="exact-admin-message">
                    Loading analytics...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="exact-admin-page">
                <div className="exact-admin-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="exact-admin-page exact-admin-analytics-page">

            <div className="exact-admin-page-header">
                <div>
                    <h1>Analytics</h1>

                    <p>
                        View your store performance and order statistics.
                    </p>
                </div>
            </div>

            <div className="exact-admin-stat-grid">

                <div className="exact-admin-stat-card purple">
                    <div className="exact-admin-stat-icon">
                        🛒
                    </div>

                    <div className="exact-admin-stat-content">
                        <span>Total Orders</span>

                        <strong>
                            {totalOrders}
                        </strong>

                        <small>
                            All orders
                        </small>
                    </div>
                </div>

                <div className="exact-admin-stat-card green">
                    <div className="exact-admin-stat-icon">
                        ₹
                    </div>

                    <div className="exact-admin-stat-content">
                        <span>Total Revenue</span>

                        <strong>
                            ₹{formatAmount(totalRevenue)}
                        </strong>

                        <small>
                            Excluding cancelled orders
                        </small>
                    </div>
                </div>

                <div className="exact-admin-stat-card orange">
                    <div className="exact-admin-stat-icon">
                        ◷
                    </div>

                    <div className="exact-admin-stat-content">
                        <span>Pending Orders</span>

                        <strong>
                            {pendingOrders}
                        </strong>

                        <small>
                            Awaiting processing
                        </small>
                    </div>
                </div>

                <div className="exact-admin-stat-card blue">
                    <div className="exact-admin-stat-icon">
                        ✓
                    </div>

                    <div className="exact-admin-stat-content">
                        <span>Delivered Orders</span>

                        <strong>
                            {deliveredOrders}
                        </strong>

                        <small>
                            Successfully delivered
                        </small>
                    </div>
                </div>

            </div>

            <div className="exact-admin-analytics-grid">

                <section className="exact-admin-panel">

                    <div className="exact-admin-panel-header">
                        <h2>Order Status Overview</h2>
                    </div>

                    <div className="exact-admin-analytics-content">

                        <div className="exact-admin-analytics-row">
                            <div>
                                <span>Pending</span>
                                <strong>
                                    {pendingOrders}
                                </strong>
                            </div>

                            <div className="exact-admin-progress">
                                <div
                                    className="pending"
                                    style={{
                                        width: `${getPercentage(
                                            pendingOrders
                                        )}%`
                                    }}
                                />
                            </div>

                            <small>
                                {getPercentage(
                                    pendingOrders
                                )}%
                            </small>
                        </div>

                        <div className="exact-admin-analytics-row">
                            <div>
                                <span>Confirmed</span>
                                <strong>
                                    {confirmedOrders}
                                </strong>
                            </div>

                            <div className="exact-admin-progress">
                                <div
                                    className="confirmed"
                                    style={{
                                        width: `${getPercentage(
                                            confirmedOrders
                                        )}%`
                                    }}
                                />
                            </div>

                            <small>
                                {getPercentage(
                                    confirmedOrders
                                )}%
                            </small>
                        </div>

                        <div className="exact-admin-analytics-row">
                            <div>
                                <span>Shipped</span>
                                <strong>
                                    {shippedOrders}
                                </strong>
                            </div>

                            <div className="exact-admin-progress">
                                <div
                                    className="shipped"
                                    style={{
                                        width: `${getPercentage(
                                            shippedOrders
                                        )}%`
                                    }}
                                />
                            </div>

                            <small>
                                {getPercentage(
                                    shippedOrders
                                )}%
                            </small>
                        </div>

                        <div className="exact-admin-analytics-row">
                            <div>
                                <span>Delivered</span>
                                <strong>
                                    {deliveredOrders}
                                </strong>
                            </div>

                            <div className="exact-admin-progress">
                                <div
                                    className="delivered"
                                    style={{
                                        width: `${getPercentage(
                                            deliveredOrders
                                        )}%`
                                    }}
                                />
                            </div>

                            <small>
                                {getPercentage(
                                    deliveredOrders
                                )}%
                            </small>
                        </div>

                        <div className="exact-admin-analytics-row">
                            <div>
                                <span>Cancelled</span>
                                <strong>
                                    {cancelledOrders}
                                </strong>
                            </div>

                            <div className="exact-admin-progress">
                                <div
                                    className="cancelled"
                                    style={{
                                        width: `${getPercentage(
                                            cancelledOrders
                                        )}%`
                                    }}
                                />
                            </div>

                            <small>
                                {getPercentage(
                                    cancelledOrders
                                )}%
                            </small>
                        </div>

                    </div>

                </section>

                <section className="exact-admin-panel">

                    <div className="exact-admin-panel-header">
                        <h2>Store Summary</h2>
                    </div>

                    <div className="exact-admin-analytics-summary">

                        <div>
                            <span>Total Orders</span>
                            <strong>
                                {totalOrders}
                            </strong>
                        </div>

                        <div>
                            <span>Total Revenue</span>
                            <strong>
                                ₹{formatAmount(totalRevenue)}
                            </strong>
                        </div>

                        <div>
                            <span>Average Order Value</span>
                            <strong>
                                ₹
                                {formatAmount(
                                    totalOrders
                                        ? totalRevenue /
                                              totalOrders
                                        : 0
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Successful Deliveries</span>
                            <strong>
                                {deliveredOrders}
                            </strong>
                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
}

export default Analytics;