
const API_URL = process.env.REACT_APP_API_URL;

// GET WISHLIST
export const getWishlist = async (token) => {
    const response = await fetch(
        `${API_URL}/wishlist`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to fetch wishlist"
        );
    }

    return result;
};

// ADD TO WISHLIST
export const addToWishlist = async (productId, token) => {
    const response = await fetch(
        `${API_URL}/wishlist/${productId}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to add to wishlist"
        );
    }

    return result;
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (productId, token) => {
    const response = await fetch(
        `${API_URL}/wishlist/${productId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to remove from wishlist"
        );
    }

    return result;
};
