import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/Context";

const API_URL = process.env.REACT_APP_API_URL;

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { currentUser } = useAppContext();

    useEffect(() => {
        const fetchOrders = async () => {
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

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "pending"
    ).length;

    const confirmedOrders = orders.filter(
        (order) => order.status === "confirmed"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "delivered"
    ).length;

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 5);

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN"
        );
    };

    return (
        <div className="exact-admin-page exact-admin-dashboard-page">

            <div className="exact-admin-page-header">
                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Welcome back! Here's an overview of your store.
                    </p>
                </div>

                <div className="exact-admin-profile">

                    <div className="exact-admin-profile-avatar">
                        A
                    </div>

                    <div className="exact-admin-profile-text">
                        <strong>Admin</strong>

                        <span>
                            {currentUser?.email || "admin@gmail.com"}
                        </span>
                    </div>

                    <span className="exact-admin-profile-arrow">
                        ⌄
                    </span>

                </div>
            </div>

            {loading && (
                <div className="exact-admin-message">
                    Loading dashboard...
                </div>
            )}

            {error && (
                <div className="exact-admin-error">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>

                    <div className="exact-admin-stat-grid">

                        <Link
                            to="/admin/orders"
                            className="exact-admin-stat-card purple"
                        >
                            <div className="exact-admin-stat-icon">
                                🛒
                            </div>

                            <div className="exact-admin-stat-content">
                                <span>Total Orders</span>

                                <strong>
                                    {totalOrders}
                                </strong>

                                <small>
                                    View all orders →
                                </small>
                            </div>
                        </Link>

                        <Link
                            to="/admin/orders?status=pending"
                            className="exact-admin-stat-card orange"
                        >
                            <div className="exact-admin-stat-icon">
                                ◷
                            </div>

                            <div className="exact-admin-stat-content">
                                <span>Pending Orders</span>

                                <strong>
                                    {pendingOrders}
                                </strong>

                                <small>
                                    View pending orders →
                                </small>
                            </div>
                        </Link>

                        <Link
                            to="/admin/orders?status=confirmed"
                            className="exact-admin-stat-card blue"
                        >
                            <div className="exact-admin-stat-icon">
                                ✓
                            </div>

                            <div className="exact-admin-stat-content">
                                <span>Confirmed Orders</span>

                                <strong>
                                    {confirmedOrders}
                                </strong>

                                <small>
                                    View confirmed orders →
                                </small>
                            </div>
                        </Link>

                        <Link
                            to="/admin/orders?status=delivered"
                            className="exact-admin-stat-card green"
                        >
                            <div className="exact-admin-stat-icon">
                                🚚
                            </div>

                            <div className="exact-admin-stat-content">
                                <span>Delivered Orders</span>

                                <strong>
                                    {deliveredOrders}
                                </strong>

                                <small>
                                    View delivered orders →
                                </small>
                            </div>
                        </Link>

                    </div>

                    <div className="exact-admin-dashboard-grid">

                        <section className="exact-admin-panel">

                            <div className="exact-admin-panel-header">
                                <h2>Recent Orders</h2>

                                <Link to="/admin/orders">
                                    View All
                                </Link>
                            </div>

                            {recentOrders.length === 0 ? (
                                <div className="exact-admin-empty">
                                    No orders found.
                                </div>
                            ) : (
                                <div className="exact-admin-table-wrap">

                                    <table className="exact-admin-table">

                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {recentOrders.map((order) => (
                                                <tr key={order._id}>

                                                    <td>
                                                        <Link
                                                            to={`/admin/orders/${order._id}`}
                                                            className="exact-admin-order-id"
                                                        >
                                                            #{order._id.slice(-8)}
                                                        </Link>
                                                    </td>

                                                    <td>
                                                        {order.userId?.name ||
                                                            "Not available"}
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {formatAmount(
                                                            order.totalAmount
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`exact-status-badge ${order.status}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </section>

                        <section className="exact-admin-panel">

                            <div className="exact-admin-panel-header">
                                <h2>Quick Actions</h2>
                            </div>

                            <div className="exact-admin-quick-actions">

                                <Link
                                    to="/admin/products"
                                    className="exact-admin-action-card"
                                >
                                    <div className="exact-admin-action-icon">
                                        ◇
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Products
                                        </strong>

                                        <span>
                                            Add, Edit, Delete products
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/categories"
                                    className="exact-admin-action-card"
                                >
                                    <div className="exact-admin-action-icon">
                                        ▦
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Categories
                                        </strong>

                                        <span>
                                            Organize your product categories
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/orders"
                                    className="exact-admin-action-card"
                                >
                                    <div className="exact-admin-action-icon">
                                        🛒
                                    </div>

                                    <div>
                                        <strong>
                                            View All Orders
                                        </strong>

                                        <span>
                                            Check and manage orders
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/analytics"
                                    className="exact-admin-action-card"
                                >
                                    <div className="exact-admin-action-icon">
                                        ▥
                                    </div>

                                    <div>
                                        <strong>
                                            Analytics
                                        </strong>

                                        <span>
                                            View store performance
                                        </span>
                                    </div>
                                </Link>

                            </div>

                        </section>

                    </div>

                </>
            )}

        </div>
    );
}

export default AdminDashboard;