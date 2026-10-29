
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/Context";
import {
  checkReviewEligibility,
  saveReview,
} from "../api/reviewApi";



const API_URL = process.env.REACT_APP_API_URL;

function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAppContext();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [eligible, setEligible] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setMessage("");

        // Fetch product details
        const productResponse = await fetch(
          `${API_URL}/product/${id}`
        );

        if (!productResponse.ok) {
          throw new Error("Unable to load product.");
        }

        const result = await productResponse.json();

        // Your product API returns { status, data }
        if (!result.status || !result.data) {
          throw new Error("Product details not found.");
        }

        if (!active) return;

        setProduct(result.data);

        // Login check
        if (!isLoggedIn || !token) {
          setMessage("Please log in to review this product.");
          return;
        }

        // Check review eligibility
        const eligibilityData =
          await checkReviewEligibility(id, token);

        if (!active) return;

        setEligible(eligibilityData.eligible);
        setHasReviewed(eligibilityData.hasReviewed);
      } catch (error) {
        if (active) {
          setMessage(
            error.message || "Something went wrong."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      active = false;
    };
  }, [id, isLoggedIn, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !token) {
      setMessage("Please log in first.");
      return;
    }

    if (!eligible) {
      setMessage(
        "You are not eligible to review this product."
      );
      return;
    }

    if (!comment.trim()) {
      setMessage("Please enter your review.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await saveReview(
        id,
        Number(rating),
        comment.trim(),
        token
      );

      navigate(`/products/${id}`);
    } catch (error) {
      setMessage(
        error.message || "Failed to save review."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="review-page">
        <p>Loading review page...</p>
      </div>
    );
  }

  return (
    <div className="review-page">
      <button
        type="button"
        className="review-back-button"
        onClick={() => navigate(`/products/${id}`)}
      >
        ← Back to Product
      </button>

      <h1>Write a Review</h1>

      {product && (
        <p className="review-product-name">
          {product.name || product.title}
        </p>
      )}

      {message && (
        <div className="review-message" role="status">
          {message}
        </div>
      )}

      {!isLoggedIn || !token ? (
        <button
          type="button"
          className="review-submit-button"
          onClick={() => navigate("/login")}
        >
          Login to Continue
        </button>
      ) : !eligible ? (
        <div className="review-message">
          {hasReviewed
            ? "You have already reviewed this product."
            : "You can review this product after an eligible delivery."}
        </div>
      ) : (
        <form
          className="review-form"
          onSubmit={handleSubmit}
        >
          {/* Rating */}
          <div className="review-field">
            <label>Rating</label>

            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`review-star ${
                    star <= rating ? "active" : ""
                  }`}
                  onClick={() => setRating(star)}
                  aria-label={`${star} stars`}
                  aria-pressed={rating === star}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="review-rating-text">
              {rating} out of 5 stars
            </div>
          </div>

          {/* Comment */}
          <div className="review-field">
            <label htmlFor="review-comment">
              Your Review
            </label>

            <textarea
              id="review-comment"
              className="review-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              maxLength={1000}
              required
              rows={6}
            />

            <div className="review-char-count">
              {comment.length}/1000
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="review-submit-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReviewPage;
