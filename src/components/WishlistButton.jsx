
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import { useWishlist } from "../context/WishlistContext";

function WishlistButton({ product, className = "" }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useAppContext();

    const {
        addToWishlist,
        removeFromWishlist,
        isWishlisted
    } = useWishlist();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const productId = String(product?._id ?? product?.id ?? "");
    const wishlisted = isWishlisted(productId);

    const handleWishlist = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (!productId || loading) return;

        setLoading(true);
        setError("");

        try {
            if (wishlisted) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        } catch (err) {
            setError(err.message || "Wishlist update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`wishlist-button-wrapper ${className}`}>
            <button
                type="button"
                className={`wishlist-heart ${
                    wishlisted ? "active" : ""
                }`}
                onClick={handleWishlist}
                disabled={loading || !productId}
                aria-label={
                    wishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                }
                aria-pressed={wishlisted}
                title={
                    wishlisted
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"
                }
            >
                {loading ? "…" : wishlisted ? "❤️" : "🤍"}
            </button>

            {error && (
                <span className="wishlist-button-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}

export default WishlistButton;
