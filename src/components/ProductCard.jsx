
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/Context";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const { addToCart } = useCart();
    const { isLoggedIn } = useAppContext();

    const {
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
    } = useWishlist();

    const [adding, setAdding] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [error, setError] = useState("");

    if (!product) {
        return null;
    }

    const productId = product._id;
    const isOutOfStock = Number(product.stock) < 1;
    const wishlisted = isWishlisted(productId);

    // ADD TO CART
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (!productId) {
            setError("Product ID is missing");
            return;
        }

        if (isOutOfStock) {
            setError("Product is out of stock");
            return;
        }

        try {
            setAdding(true);
            setError("");

            const result = await addToCart(productId, 1);

            if (!result?.success) {
                setError(
                    result?.message ||
                    "Unable to add product to cart"
                );
                return;
            }
        } catch (err) {
            setError(
                err.message || "Something went wrong"
            );
        } finally {
            setAdding(false);
        }
    };

    // ADD / REMOVE FROM WISHLIST
    const handleWishlist = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (!productId || wishlistLoading) {
            return;
        }

        try {
            setWishlistLoading(true);
            setError("");

            if (wishlisted) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (err) {
            setError(
                err.message || "Wishlist update failed"
            );
        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <article className="product-card">
            {/* PRODUCT IMAGE */}
            <div className="product-card-image-container">
                <Link
                    to={`/products/${productId}`}
                    className="product-card-image-link"
                    aria-label={`View ${product.name || "product"}`}
                >
                    <img
                        className="product-card-image"
                        src={
                            product.image ||
                            "https://via.placeholder.com/300?text=No+Image"
                        }
                        alt={product.name || "Product"}
                        loading="lazy"
                    />
                </Link>

                {/* WISHLIST HEART */}
                <button
                    type="button"
                    className={`product-wishlist-heart ${
                        wishlisted ? "active" : ""
                    }`}
                    onClick={handleWishlist}
                    disabled={wishlistLoading || !productId}
                    aria-label={
                        wishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                    }
                    aria-pressed={wishlisted}
                    title={
                        wishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                    }
                >
                    {wishlistLoading
                        ? "…"
                        : wishlisted
                        ? "❤️"
                        : "🤍"}
                </button>
            </div>

            {/* PRODUCT CONTENT */}
            <div className="product-card-content">
                <h3>
                    {product.name || "Unnamed Product"}
                </h3>

                <p className="product-card-category">
                    {product.categoryId?.name ||
                        "Category not available"}
                </p>

                <h4 className="product-card-price">
                    ₹{product.price}
                </h4>

                {/* ERROR ONLY - NO WISHLIST SUCCESS MESSAGE */}
                {error && (
                    <div
                        className="product-cart-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="product-card-actions">
                    <Link
                        to={`/products/${productId}`}
                        className="product-card-button"
                    >
                        View Details
                    </Link>

                    <button
                        type="button"
                        className="product-card-button"
                        onClick={handleAddToCart}
                        disabled={adding || isOutOfStock}
                    >
                        {adding
                            ? "Adding..."
                            : isOutOfStock
                            ? "Out of Stock"
                            : "Add to Cart"}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
