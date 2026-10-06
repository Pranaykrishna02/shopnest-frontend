import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/Context";

const API_URL = process.env.REACT_APP_API_URL;

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();
    const { isLoggedIn } = useAppContext();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/product/${id}`
                );

                const result = await response.json();

                if (!response.ok || !result.status) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch product"
                    );
                }

                setProduct(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const increaseQuantity = () => {
        if (
            product &&
            quantity < product.stock
        ) {
            setQuantity((current) => current + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((current) => current - 1);
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (!product) {
            return;
        }

        if (product.stock < 1) {
            setError("Product is out of stock");
            return;
        }

        try {
            setAddingToCart(true);
            setError("");
            setSuccessMessage("");

            const result = await addToCart(
                product._id,
                quantity
            );

            if (!result.success) {
                setError(result.message);
                return;
            }

            setSuccessMessage(
                result.message ||
                "Product added to cart successfully"
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="product-not-found">
                <h1>Loading product...</h1>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="product-not-found">
                <h1>Product Not Found</h1>

                <p>{error}</p>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h1>Product Not Found</h1>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-details">
            <div className="product-details-image">
                <img
                    src={
                        product.image ||
                        "https://via.placeholder.com/500?text=No+Image"
                    }
                    alt={product.name}
                />
            </div>

            <div className="product-details-info">
                <h1>{product.name}</h1>

                <h2>₹{product.price}</h2>

                <p>
                    <strong>Description:</strong>{" "}
                    {product.description}
                </p>

                <p>
                    <strong>Category:</strong>{" "}
                    {product.categoryId?.name ||
                        "Not available"}
                </p>

                <p>
                    <strong>Stock:</strong>{" "}
                    {product.stock}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {product.status}
                </p>

                {error && (
                    <div className="product-form-error">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="product-success-message">
                        {successMessage}
                    </div>
                )}

                <div className="quantity-section">
                    <h3>Quantity</h3>

                    <div className="quantity-controls">
                        <button
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>

                        <span>{quantity}</span>

                        <button
                            onClick={increaseQuantity}
                            disabled={
                                quantity >=
                                product.stock
                            }
                        >
                            +
                        </button>
                    </div>
                </div>

                <button
                    className="add-cart-button"
                    onClick={handleAddToCart}
                    disabled={
                        addingToCart ||
                        product.stock < 1
                    }
                >
                    {addingToCart
                        ? "Adding..."
                        : product.stock < 1
                        ? "Out of Stock"
                        : "Add to Cart"}
                </button>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Back to Products
                </button>
            </div>
        </div>
    );
}

export default ProductDetails;