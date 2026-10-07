import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import OrderCard from "../components/OrderCard";

const API_URL = process.env.REACT_APP_API_URL;

function Orders() {
    const navigate = useNavigate();

    const {
        currentUser,
        isLoggedIn
    } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoggedIn || !currentUser?.userId) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/order/user/${currentUser.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`
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
    }, [isLoggedIn, currentUser]);

    /* =========================================
       NOT LOGGED IN
    ========================================= */

    if (!isLoggedIn) {
        return (
            <div className="orders-page">
                <div className="orders-container">

                    <h1>My Orders</h1>

                    <div className="orders-error">
                        Please login to view your orders.
                    </div>

                    <button
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>
            </div>
        );
    }

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-container">

                    <h1>My Orders</h1>

                    <div className="orders-message">
                        Loading orders...
                    </div>

                </div>
            </div>
        );
    }

    /* =========================================
       ERROR
    ========================================= */

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-container">

                    <h1>My Orders</h1>

                    <div className="orders-error">
                        {error}
                    </div>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    /* =========================================
       EMPTY ORDERS
    ========================================= */

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="orders-container">

                    <h1>My Orders</h1>

                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            📦
                        </div>

                        <h2>No Orders Found</h2>

                        <p>
                            You have not placed any
                            orders yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    /* =========================================
       ORDERS
    ========================================= */

    return (
        <div className="orders-page">

            <div className="orders-container">

                <div className="orders-header">

                    <div>
                        <h1>My Orders</h1>

                        <p>
                            {orders.length} order
                            {orders.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

                <div className="orders-list">

                    {orders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                        />
                    ))}

                </div>

            </div>

        </div>
    );
}

export default Orders;