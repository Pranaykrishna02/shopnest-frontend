import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import { useAppContext } from "./Context";

const CartContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;

export function CartProvider({ children }) {
    const { currentUser, isLoggedIn } = useAppContext();

    const userId = currentUser?.userId;

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [updatingCart, setUpdatingCart] = useState(false);
    const [removingCart, setRemovingCart] = useState(false);
    const [clearingCart, setClearingCart] = useState(false);
    const [error, setError] = useState("");

    const refreshCart = useCallback(async () => {
        if (!isLoggedIn || !userId) {
            setCartItems([]);
            setCartTotal(0);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/cart/${userId}`
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to fetch cart"
                );
            }

            setCartItems(result.data?.items || []);
            setCartTotal(result.data?.grandTotal || 0);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, userId]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (
        productId,
        quantity = 1
    ) => {
        if (!isLoggedIn || !userId) {
            return {
                success: false,
                message: "Please login to add products to cart"
            };
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/cart/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId,
                        productId,
                        quantity
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                setError(
                    result.message ||
                    "Failed to add product to cart"
                );

                return {
                    success: false,
                    message:
                        result.message ||
                        "Failed to add product to cart"
                };
            }

            await refreshCart();

            return {
                success: true,
                message:
                    result.message ||
                    "Product added to cart successfully"
            };

        } catch (error) {
            setError(error.message);

            return {
                success: false,
                message: error.message
            };
        }
    };

    const updateQuantity = async (
        cartId,
        quantity
    ) => {
        if (quantity < 1) {
            return {
                success: false,
                message: "Quantity must be greater than 0"
            };
        }

        try {
            setUpdatingCart(true);
            setError("");

            const response = await fetch(
                `${API_URL}/cart/${cartId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        quantity
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                setError(
                    result.message ||
                    "Failed to update quantity"
                );

                return {
                    success: false,
                    message:
                        result.message ||
                        "Failed to update quantity"
                };
            }

            setCartItems((currentItems) => {
                const updatedItems =
                    currentItems.map((item) => {
                        if (item._id !== cartId) {
                            return item;
                        }

                        const itemTotal =
                            Number(item.price) *
                            Number(quantity);

                        return {
                            ...item,
                            quantity: quantity,
                            itemTotal: itemTotal
                        };
                    });

                const newCartTotal =
                    updatedItems.reduce(
                        (total, item) =>
                            total +
                            Number(item.itemTotal || 0),
                        0
                    );

                setCartTotal(newCartTotal);

                return updatedItems;
            });

            return {
                success: true,
                message:
                    "Cart quantity updated successfully"
            };

        } catch (error) {
            setError(error.message);

            return {
                success: false,
                message: error.message
            };
        } finally {
            setUpdatingCart(false);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            setRemovingCart(true);
            setError("");

            const response = await fetch(
                `${API_URL}/cart/${cartId}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                setError(
                    result.message ||
                    "Failed to remove cart item"
                );

                return {
                    success: false,
                    message:
                        result.message ||
                        "Failed to remove cart item"
                };
            }

            setCartItems((currentItems) =>
                currentItems.filter(
                    (item) => item._id !== cartId
                )
            );

            const remainingItems =
                cartItems.filter(
                    (item) => item._id !== cartId
                );

            const newCartTotal =
                remainingItems.reduce(
                    (total, item) =>
                        total +
                        Number(item.itemTotal || 0),
                    0
                );

            setCartTotal(newCartTotal);

            return {
                success: true,
                message:
                    "Cart item removed successfully"
            };

        } catch (error) {
            setError(error.message);

            return {
                success: false,
                message: error.message
            };
        } finally {
            setRemovingCart(false);
        }
    };

    const clearCart = async () => {
        if (!userId) {
            return {
                success: false,
                message:
                    "User information is not available"
            };
        }

        try {
            setClearingCart(true);
            setError("");

            const response = await fetch(
                `${API_URL}/cart/user/${userId}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                setError(
                    result.message ||
                    "Failed to clear cart"
                );

                return {
                    success: false,
                    message:
                        result.message ||
                        "Failed to clear cart"
                };
            }

            setCartItems([]);
            setCartTotal(0);

            return {
                success: true,
                message:
                    "Cart cleared successfully"
            };

        } catch (error) {
            setError(error.message);

            return {
                success: false,
                message: error.message
            };
        } finally {
            setClearingCart(false);
        }
    };

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                cartCount,
                cartTotal,
                loading,
                updatingCart,
                removingCart,
                clearingCart,
                error,
                refreshCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}