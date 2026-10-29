
const API_URL = process.env.REACT_APP_API_URL;

// Safely read API response
const readResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();

        console.error("Expected JSON but received:", text);

        throw new Error(
            `API returned non-JSON response (${response.status}). Check API URL and backend route.`
        );
    }

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "API request failed"
        );
    }

    return result;
};

// Get product reviews (public)
export const getReviews = async (productId) => {
    const response = await fetch(
        `${API_URL}/review/${productId}`
    );

    return await readResponse(response);
};

// Check review eligibility
export const checkReviewEligibility = async (
    productId,
    token
) => {
    const response = await fetch(
        `${API_URL}/review/${productId}/eligibility`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return await readResponse(response);
};

// Add or update product review
// Supports text-only reviews and media reviews
export const saveReview = async (
    productId,
    rating,
    comment,
    token,
    media = {}
) => {
    const { images = [], video = null } = media;

    const hasMedia =
        images.length > 0 || Boolean(video);

    let body;
    const headers = {
        Authorization: `Bearer ${token}`
    };

    if (hasMedia) {
        const formData = new FormData();

        formData.append("rating", String(rating));
        formData.append("comment", comment);

        images.forEach((image) => {
            formData.append("images", image);
        });

        if (video) {
            formData.append("video", video);
        }

        body = formData;

        // IMPORTANT:
        // Do not set Content-Type manually.
        // Browser sets multipart/form-data boundary.
    } else {
        headers["Content-Type"] = "application/json";

        body = JSON.stringify({
            rating,
            comment
        });
    }

    const response = await fetch(
        `${API_URL}/review/${productId}`,
        {
            method: "POST",
            headers,
            body
        }
    );

    return await readResponse(response);
};
