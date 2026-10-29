
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/Context";
import { getReviews } from "../api/reviewApi";

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

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");

  // Fetch product
  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/product/${id}`);
        const result = await response.json();

        if (!response.ok || !result.status) {
          throw new Error(result.message || "Failed to fetch product");
        }

        if (!cancelled) {
          setProduct(result.data);
          setQuantity(1);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch public reviews
  const fetchProductReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      setReviewError("");

      const result = await getReviews(id);

      if (!Array.isArray(result)) {
        throw new Error("Invalid reviews response");
      }

      setReviews(result);
    } catch (err) {
      setReviewError(err.message || "Unable to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductReviews();
  }, [fetchProductReviews]);

  // Quantity controls
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!product) return;

    if (product.stock < 1) {
      setError("Product is out of stock");
      return;
    }

    try {
      setAddingToCart(true);
      setError("");
      setSuccessMessage("");

      const result = await addToCart(product._id, quantity);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccessMessage(
        result.message || "Product added to cart successfully"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  // Rating summary
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (total, review) => total + Number(review.rating || 0),
          0
        ) / totalReviews
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter(
      (review) => Number(review.rating) === star
    ).length,
  }));

  // Loading
  if (loading) {
    return (
      <div className="product-not-found">
        <h1>Loading product...</h1>
      </div>
    );
  }

  // Error
  if (error && !product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found</h1>
        <button onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <main className="sn-product-page">
      {/* Product details */}
      <section className="sn-product-layout">
        <div className="sn-product-gallery">
          <div className="sn-product-image-frame">
            <img
              src={
                product.image ||
                "https://via.placeholder.com/600?text=No+Image"
              }
              alt={product.name}
            />
          </div>

          <div className="sn-image-caption">
            <span>SHOPNEST</span>
            <span>Quality you can trust</span>
          </div>
        </div>

        <div className="sn-product-info">
          <span className="sn-product-badge">
            PRODUCT DETAILS
          </span>

          <h1>{product.name}</h1>

          <button
            className="sn-rating-link"
            onClick={() =>
              document
                .getElementById("reviews")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="sn-stars-filled">
              ★★★★★
            </span>
            <span>
              {totalReviews > 0
                ? `${averageRating.toFixed(1)} · ${totalReviews} reviews`
                : "No reviews yet"}
            </span>
          </button>

          <div className="sn-price">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </div>

          <p className="sn-tax-note">
            Product pricing as displayed
          </p>

          <div className="sn-product-divider" />

          <div className="sn-detail-row">
            <span>Category</span>
            <strong>
              {product.categoryId?.name || "Not available"}
            </strong>
          </div>

          <div className="sn-detail-row">
            <span>Availability</span>
            <strong
              className={
                product.stock > 0
                  ? "sn-in-stock"
                  : "sn-out-stock"
              }
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </strong>
          </div>

          <div className="sn-detail-row">
            <span>Stock</span>
            <strong>{product.stock}</strong>
          </div>

          <div className="sn-product-description">
            <h3>About this product</h3>
            <p>
              {product.description || "No description available."}
            </p>
          </div>

          {error && (
            <div className="sn-product-alert sn-error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="sn-product-alert sn-success">
              {successMessage}
            </div>
          )}

          <div className="sn-purchase-row">
            <div className="sn-quantity">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="sn-add-cart"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock < 1}
            >
              {addingToCart
                ? "Adding..."
                : product.stock < 1
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          </div>

          <button
            className="sn-back-products"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </button>
        </div>
      </section>

      {/* Reviews */}
      <section className="sn-reviews-section" id="reviews">
        <div className="sn-reviews-heading">
          <div>
            <span className="sn-section-eyebrow">
              CUSTOMER FEEDBACK
            </span>
            <h2>Customer Reviews</h2>
            <p>Real feedback from our customers</p>
          </div>

          {totalReviews > 0 && (
            <span className="sn-review-count">
              {totalReviews}{" "}
              {totalReviews === 1 ? "Review" : "Reviews"}
            </span>
          )}
        </div>

        {reviewsLoading ? (
          <div className="sn-review-state">
            Loading customer reviews...
          </div>
        ) : reviewError && reviews.length === 0 ? (
          <div className="sn-review-state sn-error">
            {reviewError}
            <button onClick={fetchProductReviews}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Rating summary */}
            <div className="sn-rating-summary">
              <div className="sn-rating-overview">
                <strong className="sn-average-rating">
                  {totalReviews > 0
                    ? averageRating.toFixed(1)
                    : "—"}
                  <span>/5</span>
                </strong>

                <div className="sn-summary-stars">
                  {"★".repeat(
                    Math.round(averageRating)
                  )}
                  {"☆".repeat(
                    5 - Math.round(averageRating)
                  )}
                </div>

                <p>
                  Based on {totalReviews}{" "}
                  {totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              <div className="sn-rating-breakdown">
                {ratingCounts.map(({ star, count }) => {
                  const percentage =
                    totalReviews > 0
                      ? (count / totalReviews) * 100
                      : 0;

                  return (
                    <div
                      className="sn-rating-bar-row"
                      key={star}
                    >
                      <span>{star} ★</span>

                      <div className="sn-rating-track">
                        <div
                          className="sn-rating-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="sn-rating-count">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write review action */}
            <div className="sn-review-action">
              <div>
                <h3>Have you tried this product?</h3>
                <p>Share your experience with other shoppers.</p>
              </div>

              <button
                className="sn-write-review"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }

                  navigate(`/products/${id}/review`);
                }}
              >
                ✎ Write a Review
              </button>
            </div>

            {/* Review list */}
            <div className="sn-reviews-list">
              {reviews.length === 0 ? (
                <div className="sn-empty-reviews">
                  <div className="sn-empty-icon">☆</div>
                  <h3>No reviews yet</h3>
                  <p>
                    Be the first to share your thoughts about
                    this product.
                  </p>
                </div>
              ) : (
                reviews.map((review) => {
                  const customerName =
                    review.user?.name || "Customer";

                  const initial =
                    customerName.trim().charAt(0).toUpperCase() ||
                    "C";

                  return (
                    <article
                      className="sn-review-card"
                      key={review._id}
                    >
                      <div className="sn-review-avatar">
                        {initial}
                      </div>

                      <div className="sn-review-content">
                        <div className="sn-review-topline">
                          <div>
                            <h3>{customerName}</h3>
                            <span className="sn-verified">
                              Customer review
                            </span>
                          </div>

                          <time className="sn-review-date">
                            {review.updatedAt
                              ? new Date(
                                  review.updatedAt
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </time>
                        </div>

                        <div className="sn-review-rating">
                          <span>
                            {"★".repeat(
                              Number(review.rating) || 0
                            )}
                            {"☆".repeat(
                              5 - (Number(review.rating) || 0)
                            )}
                          </span>

                          <strong>
                            {review.rating}/5
                          </strong>
                        </div>

                        <p className="sn-review-comment">
                          {review.comment}
                        </p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ProductDetails;
