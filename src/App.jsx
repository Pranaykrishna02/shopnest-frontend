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
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import Analytics from "./pages/Analytics";
import ExchangeProduct from "./pages/ExchangeProduct";
import Addresses from "./pages/Addresses";
import AddressForm from "./pages/AddressForm";

import "./App.css";

function AppContent() {
    const [cartItems, setCartItems] = useState([]);

    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith("/admin");

    const addToCart = (product, quantity = 1) => {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + quantity
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

    const updateQuantity = (productId, quantity) => {
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

    const removeFromCart = (productId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== productId
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <>
            {!isAdminPage && (
                <Navbar cartCount={cartCount} />
            )}

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={
                        <Products
                            onAddToCart={addToCart}
                        />
                    }
                />

                <Route
                    path="/products/:id"
                    element={
                        <ProductDetails
                            onAddToCart={addToCart}
                        />
                    }
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart
                                cartItems={cartItems}
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                                clearCart={clearCart}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/order-confirmation/:orderId"
                    element={<OrderConfirmation />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />

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

                <Route
                      path="/exchange/:orderId/:itemId"
                         element={
                      <ExchangeProduct />
                }
              />
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