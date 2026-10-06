import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/Context";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const { addToCart } = useCart();
    const { isLoggedIn } = useAppContext();

    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const productId = product._id;

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (!productId) {
            setError("Product ID is missing");
            return;
        }

        if (product.stock < 1) {
            setError("Product is out of stock");
            return;
        }

        try {
            setAdding(true);
            setMessage("");
            setError("");

            const result = await addToCart(
                productId,
                1
            );

            if (!result.success) {
                setError(result.message);
                return;
            }

            setMessage(
                result.message ||
                "Product added to cart successfully"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="product-card">

            <img
                src={
                    product.image ||
                    "https://via.placeholder.com/300?text=No+Image"
                }
                alt={product.name}
            />

            <h3>{product.name}</h3>

            <p>
                {product.categoryId?.name ||
                    "Category not available"}
            </p>

            <h4>₹{product.price}</h4>

            {message && (
                <div className="product-cart-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="product-cart-error">
                    {error}
                </div>
            )}

            <Link to={`/products/${productId}`}>
                <button>
                    View Details
                </button>
            </Link>

            <button
                onClick={handleAddToCart}
                disabled={
                    adding ||
                    product.stock < 1
                }
            >
                {adding
                    ? "Adding..."
                    : product.stock < 1
                    ? "Out of Stock"
                    : "Add to Cart"}
            </button>

        </div>
    );
}

export default ProductCard;