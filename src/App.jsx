import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";

import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import Analytics from "./pages/Analytics";

import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import ExchangeProduct from "./pages/ExchangeProduct";

import Addresses from "./pages/Addresses";
import AddressForm from "./pages/AddressForm";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

import "./App.css";

function AppContent() {
    const [cartItems, setCartItems] = useState([]);

    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith("/admin");

    // ======================================================
    // ADD TO CART
    // ======================================================

    const addToCart = (
        product,
        quantity = 1
    ) => {
        setCartItems((currentItems) => {
            const existingItem =
                currentItems.find(
                    (item) =>
                        item.id === product.id
                );

            if (existingItem) {
                return currentItems.map(
                    (item) =>
                        item.id === product.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      quantity
                              }
                            : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity
                }
            ];
        });
    };

    // ======================================================
    // UPDATE CART QUANTITY
    // ======================================================

    const updateQuantity = (
        productId,
        quantity
    ) => {
        if (quantity < 1) {
            return;
        }

        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity
                      }
                    : item
            )
        );
    };

    // ======================================================
    // REMOVE FROM CART
    // ======================================================

    const removeFromCart = (productId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    item.id !== productId
            )
        );
    };

    // ======================================================
    // CLEAR CART
    // ======================================================

    const clearCart = () => {
        setCartItems([]);
    };

    // ======================================================
    // CART COUNT
    // ======================================================

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    return (
        <>
            {!isAdminPage && (
                <Navbar cartCount={cartCount} />
            )}

            <Routes>

                {/* ==================================================
                    HOME
                ================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                {/* ==================================================
                    PRODUCTS
                ================================================== */}

                <Route
                    path="/products"
                    element={
                        <Products
                            onAddToCart={
                                addToCart
                            }
                        />
                    }
                />

                <Route
                    path="/products/:id"
                    element={
                        <ProductDetails
                            onAddToCart={
                                addToCart
                            }
                        />
                    }
                />

                {/* ==================================================
                    AUTHENTICATION
                ================================================== */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* ==================================================
                    CART
                ================================================== */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart
                                cartItems={
                                    cartItems
                                }
                                updateQuantity={
                                    updateQuantity
                                }
                                removeFromCart={
                                    removeFromCart
                                }
                                clearCart={
                                    clearCart
                                }
                            />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    CHECKOUT
                ================================================== */}

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                {/* ==================================================
                    ORDER CONFIRMATION
                ================================================== */}

                <Route
                    path="/order-confirmation/:orderId"
                    element={
                        <OrderConfirmation />
                    }
                />

                {/* ==================================================
                    CUSTOMER ORDERS
                ================================================== */}

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />

                {/* ==================================================
                    EXCHANGE PRODUCT
                ================================================== */}

                <Route
                    path="/exchange/:orderId/:itemId"
                    element={
                        <ExchangeProduct />
                    }
                />

                {/* ==================================================
                    ADDRESSES
                ================================================== */}

                <Route
                    path="/addresses"
                    element={
                        <ProtectedRoute>
                            <Addresses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/addresses/new"
                    element={
                        <ProtectedRoute>
                            <AddressForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/addresses/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AddressForm />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    FORGOT PASSWORD
                ================================================== */}

                <Route
                    path="/forgot-password"
                    element={
                        <ForgotPassword />
                    }
                />

                {/* ==================================================
                    RESET PASSWORD
                ================================================== */}

                {/* Direct reset page */}
                <Route
                    path="/reset-password"
                    element={
                        <ResetPassword />
                    }
                />

                {/* Reset page with token */}
                <Route
                    path="/reset-password/:token"
                    element={
                        <ResetPassword />
                    }
                />

                {/* ==================================================
                    CHANGE PASSWORD
                ================================================== */}

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================================
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ==================================================
                    ADMIN PRODUCTS
                ================================================== */}

                <Route
                    path="/admin/products"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminProducts />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ==================================================
                    ADMIN CATEGORIES
                ================================================== */}

                <Route
                    path="/admin/categories"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminCategories />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ==================================================
                    ADMIN ORDERS
                ================================================== */}

                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminOrders />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders/:id"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminOrderDetails />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

                {/* ==================================================
                    ADMIN ANALYTICS
                ================================================== */}

                <Route
                    path="/admin/analytics"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <Analytics />
                            </AdminLayout>
                        </AdminRoute>
                    }
                />

            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;