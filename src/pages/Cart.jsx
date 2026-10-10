
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const navigate = useNavigate();

    const {
        cartItems,
        cartTotal,
        loading,
        updatingCart,
        removingCart,
        clearingCart,
        error,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const [showClearPopup, setShowClearPopup] = useState(false);

    const totalItems = cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    // Increase quantity
    const handleIncrease = async (item) => {
        if (updatingCart) return;

        await updateQuantity(item._id, item.quantity + 1);
    };

    // Decrease quantity
    const handleDecrease = async (item) => {
        if (updatingCart || item.quantity <= 1) return;

        await updateQuantity(item._id, item.quantity - 1);
    };

    // Remove item
    const handleRemove = async (cartId) => {
        if (removingCart) return;

        await removeFromCart(cartId);
    };

    // Clear cart popup
    const handleClearCart = () => {
        if (clearingCart) return;

        setShowClearPopup(true);
    };

    const confirmClearCart = async () => {
        setShowClearPopup(false);
        await clearCart();
    };

    const cancelClearCart = () => {
        setShowClearPopup(false);
    };

    // FIX: Navigate within React Router without reloading the page
    const handleCheckout = () => {
        navigate("/checkout");
    };

    // Loading state
    if (loading) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <h1>Shopping Cart</h1>
                    <div className="cart-message">Loading cart...</div>
                </div>
            </div>
        );
    }

    // Cart error
    if (error && cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <h1>Shopping Cart</h1>
                    <div className="cart-error">{error}</div>
                </div>
            </div>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <h1>Shopping Cart</h1>

                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <svg
                                viewBox="0 0 120 120"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="60"
                                    cy="55"
                                    r="42"
                                    className="cart-circle"
                                />

                                <path
                                    d="M30 35H42L50 72H88L96 45H45"
                                    className="cart-line"
                                />

                                <path
                                    d="M52 45V66"
                                    className="cart-line"
                                />

                                <path
                                    d="M66 45V66"
                                    className="cart-line"
                                />

                                <path
                                    d="M80 45V66"
                                    className="cart-line"
                                />

                                <path
                                    d="M48 54H91"
                                    className="cart-line"
                                />

                                <path
                                    d="M51 73H87"
                                    className="cart-line"
                                />

                                <circle
                                    cx="57"
                                    cy="82"
                                    r="6"
                                    className="cart-wheel"
                                />

                                <circle
                                    cx="83"
                                    cy="82"
                                    r="6"
                                    className="cart-wheel"
                                />

                                <path
                                    d="M25 31H34"
                                    className="cart-handle"
                                />

                                <path
                                    d="M45 25L41 19"
                                    className="cart-spark"
                                />

                                <path
                                    d="M58 21V13"
                                    className="cart-spark"
                                />

                                <path
                                    d="M71 25L75 19"
                                    className="cart-spark"
                                />

                                <path
                                    d="M81 31L87 27"
                                    className="cart-spark"
                                />
                            </svg>
                        </div>

                        <h2>Your Cart is Empty</h2>
                        <p>
                            Add some products to your cart to see them here.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <div>
                        <h1>Shopping Cart</h1>
                        <p>
                            {totalItems} item
                            {totalItems !== 1 ? "s" : ""} in your cart
                        </p>
                    </div>

                    <button
                        className="clear-cart-button"
                        onClick={handleClearCart}
                        disabled={clearingCart}
                    >
                        {clearingCart ? "Clearing..." : "Clear Cart"}
                    </button>
                </div>

                {error && (
                    <div className="cart-error">{error}</div>
                )}

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <div className="cart-item-image">
                                    <img
                                        src={
                                            item.productId?.image ||
                                            "https://via.placeholder.com/150?text=No+Image"
                                        }
                                        alt={item.productId?.name || "Product"}
                                    />
                                </div>

                                <div className="cart-item-details">
                                    <h2>
                                        {item.productId?.name || "Product"}
                                    </h2>

                                    <p className="cart-item-price">
                                        Price: ₹{item.price}
                                    </p>

                                    <div className="cart-item-info">
                                        <div className="quantity-control">
                                            <button
                                                onClick={() =>
                                                    handleDecrease(item)
                                                }
                                                disabled={
                                                    updatingCart ||
                                                    item.quantity <= 1
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                onClick={() =>
                                                    handleIncrease(item)
                                                }
                                                disabled={updatingCart}
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <span>
                                            Item Total: ₹{item.itemTotal}
                                        </span>
                                    </div>
                                </div>

                                <div className="cart-item-actions">
                                    <strong>₹{item.itemTotal}</strong>

                                    <button
                                        className="remove-cart-button"
                                        onClick={() => handleRemove(item._id)}
                                        disabled={removingCart}
                                    >
                                        {removingCart ? "Removing..." : "Remove"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Cart Summary</h2>

                        <div className="summary-row">
                            <span>Total Items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span className="free-text">FREE</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Grand Total</span>
                            <strong>₹{cartTotal}</strong>
                        </div>

                        <button
                            className="checkout-button"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>

            {showClearPopup && (
                <div className="clear-cart-overlay">
                    <div className="clear-cart-popup">
                        <div className="clear-cart-popup-icon">!</div>

                        <h2>Clear Cart?</h2>

                        <p>
                            Are you sure you want to remove all items from
                            your cart?
                        </p>

                        <div className="clear-cart-popup-actions">
                            <button
                                className="cancel-clear-button"
                                onClick={cancelClearCart}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-clear-button"
                                onClick={confirmClearCart}
                                disabled={clearingCart}
                            >
                                {clearingCart ? "Clearing..." : "Clear Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
