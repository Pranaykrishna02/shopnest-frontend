
import { useState } from "react";
import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
    const {
        wishlistItems,
        loading,
        wishlistError,
        removeFromWishlist,
        fetchWishlist
    } = useWishlist();

    const { addToCart } = useCart();

    const [removingId, setRemovingId] = useState("");
    const [addingId, setAddingId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // REMOVE FROM WISHLIST
    const handleRemove = async (productId) => {
        try {
            setRemovingId(productId);
            setError("");
            setMessage("");

            await removeFromWishlist(productId);

            setMessage("Product removed from Wishlist");
        } catch (err) {
            setError(
                err.message || "Unable to remove product"
            );
        } finally {
            setRemovingId("");
        }
    };

    // ADD TO CART
    const handleAddToCart = async (product) => {
        const productId = String(
            product._id ?? product.id ?? ""
        );

        if (!productId) {
            setError("Product ID is missing");
            return;
        }

        if (Number(product.stock) < 1) {
            setError("Product is out of stock");
            return;
        }

        try {
            setAddingId(productId);
            setError("");
            setMessage("");

            const result = await addToCart(productId, 1);

            if (!result?.success) {
                setError(
                    result?.message ||
                    "Unable to add product to cart"
                );
                return;
            }

            setMessage(
                result.message ||
                "Product added to cart successfully"
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to add product to cart"
            );
        } finally {
            setAddingId("");
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="wishlist-page">
                <h1>My Wishlist ❤️</h1>
                <p>Loading your Wishlist...</p>
            </div>
        );
    }

    // FETCH ERROR
    if (wishlistError) {
        return (
            <div className="wishlist-page">
                <h1>My Wishlist ❤️</h1>

                <p
                    className="wishlist-error"
                    role="alert"
                >
                    {wishlistError}
                </p>

                <button
                    type="button"
                    onClick={fetchWishlist}
                    className="wishlist-retry-btn"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // EMPTY WISHLIST
    if (!wishlistItems?.length) {
        return (
            <div className="wishlist-page">
                <div className="wishlist-empty">
                    <div className="wishlist-empty-icon">
                        🤍
                    </div>

                    <h1>My Wishlist</h1>

                    <h3>Your Wishlist is empty</h3>

                    <p>
                        Save your favorite products here
                        and find them whenever you need.
                    </p>

                    <Link
                        to="/products"
                        className="wishlist-shop-btn"
                    >
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    // WISHLIST PRODUCTS
    return (
        <div className="wishlist-page">

            {/* HEADER */}
            <div className="wishlist-header">
                <div>
                    <h1>My Wishlist ❤️</h1>

                    <p>
                        {wishlistItems.length} saved product(s)
                    </p>
                </div>

                <Link
                    to="/products"
                    className="wishlist-continue-btn"
                >
                    Continue Shopping
                </Link>
            </div>

            {/* SUCCESS MESSAGE */}
            {message && (
                <p
                    className="wishlist-success"
                    role="status"
                >
                    {message}
                </p>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <p
                    className="wishlist-error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {/* PRODUCT GRID */}
            <div className="wishlist-grid">
                {wishlistItems.map((product) => {
                    const productId = String(
                        product._id ?? product.id ?? ""
                    );

                    const isOutOfStock =
                        Number(product.stock) < 1;

                    return (
                        <article
                            className="wishlist-card"
                            key={productId}
                        >
                            {/* PRODUCT IMAGE */}
                            <Link
                                to={`/products/${productId}`}
                                className="wishlist-product-image-link"
                            >
                                <img
                                    src={
                                        product.image ||
                                        "https://via.placeholder.com/300?text=No+Image"
                                    }
                                    alt={
                                        product.name || "Product"
                                    }
                                    className="wishlist-product-image"
                                />
                            </Link>

                            {/* PRODUCT DETAILS */}
                            <div className="wishlist-product-content">
                                <h3>
                                    {product.name ||
                                        "Unnamed Product"}
                                </h3>

                                <p className="wishlist-category">
                                    {product.categoryId?.name ||
                                        "Category not available"}
                                </p>

                                <h4 className="wishlist-price">
                                    ₹{product.price}
                                </h4>

                                {isOutOfStock && (
                                    <p className="wishlist-stock">
                                        Out of Stock
                                    </p>
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="wishlist-actions">

                                    {/* ADD TO CART */}
                                    <button
                                        type="button"
                                        className="wishlist-add-cart-btn"
                                        disabled={
                                            isOutOfStock ||
                                            addingId === productId ||
                                            !productId
                                        }
                                        onClick={() =>
                                            handleAddToCart(product)
                                        }
                                    >
                                        {addingId === productId
                                            ? "Adding..."
                                            : isOutOfStock
                                            ? "Out of Stock"
                                            : "Add to Cart"}
                                    </button>

                                    {/* REMOVE */}
                                    <button
                                        type="button"
                                        className="wishlist-remove-btn"
                                        disabled={
                                            removingId === productId
                                        }
                                        onClick={() =>
                                            handleRemove(productId)
                                        }
                                    >
                                        {removingId === productId
                                            ? "Removing..."
                                            : "Remove ❤️"}
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default Wishlist;
