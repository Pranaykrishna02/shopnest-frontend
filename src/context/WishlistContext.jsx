
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import { useAppContext } from "./Context";
import {
    getWishlist,
    addToWishlist as addWishlistAPI,
    removeFromWishlist as removeWishlistAPI
} from "../api/wishlistApi";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { token, isLoggedIn } = useAppContext();

    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlistError, setWishlistError] = useState("");

    // Get product ID
    const getProductId = (product) => {
        if (!product) return "";

        const value =
            product._id ??
            product.id ??
            product;

        return String(value);
    };

    // FETCH WISHLIST
    const fetchWishlist = useCallback(async () => {
        if (!token) {
            setWishlistItems([]);
            setWishlistError("");
            return;
        }

        try {
            setLoading(true);
            setWishlistError("");

            const result = await getWishlist(token);

            // Backend returns wishlist directly
            setWishlistItems(
                Array.isArray(result.products)
                    ? result.products.filter(Boolean)
                    : []
            );
        } catch (error) {
            setWishlistError(error.message || "Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Load wishlist after login / token change
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Clear wishlist on logout
    useEffect(() => {
        if (!isLoggedIn || !token) {
            setWishlistItems([]);
            setWishlistError("");
        }
    }, [isLoggedIn, token]);

    // CHECK PRODUCT
    const isWishlisted = (productId) => {
        return wishlistItems.some(
            (item) => getProductId(item) === String(productId)
        );
    };

    // ADD PRODUCT
    const addToWishlist = async (productId) => {
        if (!token) {
            throw new Error("Please login to use wishlist");
        }

        if (!productId) {
            throw new Error("Invalid product");
        }

        if (isWishlisted(productId)) {
            return;
        }

        setWishlistError("");

        try {
            await addWishlistAPI(productId, token);
            await fetchWishlist();
        } catch (error) {
            setWishlistError(error.message);
            throw error;
        }
    };

    // REMOVE PRODUCT
    const removeFromWishlist = async (productId) => {
        if (!token) {
            throw new Error("Please login to use wishlist");
        }

        setWishlistError("");

        try {
            await removeWishlistAPI(productId, token);

            setWishlistItems((currentItems) =>
                currentItems.filter(
                    (item) =>
                        getProductId(item) !== String(productId)
                )
            );
        } catch (error) {
            setWishlistError(error.message);
            throw error;
        }
    };

    // WISHLIST COUNT
    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                wishlistCount,
                loading,
                wishlistError,
                fetchWishlist,
                addToWishlist,
                removeFromWishlist,
                isWishlisted
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error(
            "useWishlist must be used inside WishlistProvider"
        );
    }

    return context;
}
