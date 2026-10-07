import {
    useCallback,
    useEffect,
    useState
} from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";

const API_URL = process.env.REACT_APP_API_URL;

function Addresses() {
    const navigate = useNavigate();

    const { currentUser } = useAppContext();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAddresses = useCallback(async () => {
        if (!currentUser?.userId) {
            setAddresses([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/address/user/${currentUser.userId}`
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to load addresses"
                );
            }

            setAddresses(result.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [currentUser?.userId]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleDelete = async (addressId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/address/${addressId}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to delete address"
                );
            }

            await fetchAddresses();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            setError("");

            const response = await fetch(
                `${API_URL}/address/${addressId}/default`,
                {
                    method: "PUT"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to set default address"
                );
            }

            await fetchAddresses();
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="addresses-page">
                <div className="addresses-container">
                    <div className="addresses-loading">
                        Loading your addresses...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="addresses-page">
            <div className="addresses-container">

                {/* Header */}
                <div className="addresses-header">
                    <div>
                        <span className="addresses-eyebrow">
                            ACCOUNT
                        </span>

                        <h1>Your Addresses</h1>

                        <p>
                            Manage your delivery addresses
                        </p>
                    </div>

                    <button
                        className="add-address-button"
                        onClick={() =>
                            navigate("/addresses/new")
                        }
                    >
                        <span>+</span>
                        Add a new address
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="address-error">
                        {error}
                    </div>
                )}

                {/* Section Header */}
                <div className="addresses-section-header">
                    <h2>Your saved addresses</h2>

                    <span>
                        {addresses.length}{" "}
                        {addresses.length === 1
                            ? "address"
                            : "addresses"}
                    </span>
                </div>

                {/* Empty State */}
                {addresses.length === 0 ? (
                    <div className="empty-addresses">
                        <div className="empty-address-icon">
                            📍
                        </div>

                        <h2>
                            No saved addresses
                        </h2>

                        <p>
                            Add a delivery address to make
                            your next checkout faster.
                        </p>

                        <button
                            className="add-address-button"
                            onClick={() =>
                                navigate("/addresses/new")
                            }
                        >
                            + Add a new address
                        </button>
                    </div>
                ) : (
                    /* Address List */
                    <div className="address-grid">
                        {addresses.map((item) => (
                            <div
                                className={`address-card ${
                                    item.isDefault
                                        ? "default-address"
                                        : ""
                                }`}
                                key={item._id}
                            >

                                {/* Default Badge */}
                                {item.isDefault && (
                                    <div className="default-address-badge">
                                        ✓ Default
                                    </div>
                                )}

                                {/* Name */}
                                <h3>
                                    {item.fullName}
                                </h3>

                                {/* Address Details */}
                                <div className="address-details">
                                    <p>
                                        {item.address}
                                    </p>

                                    <p>
                                        {item.city},{" "}
                                        {item.state}{" "}
                                        {item.pincode}
                                    </p>

                                    <p>
                                        India
                                    </p>

                                    <p className="address-phone">
                                        Phone number:{" "}
                                        {item.phone}
                                    </p>
                                </div>

                                {/* Edit / Remove */}
                                <div className="address-actions">
                                    <button
                                        className="edit-address-button"
                                        onClick={() =>
                                            navigate(
                                                `/addresses/edit/${item._id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-address-button"
                                        onClick={() =>
                                            handleDelete(
                                                item._id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Set Default */}
                                {!item.isDefault && (
                                    <button
                                        className="set-default-button"
                                        onClick={() =>
                                            handleSetDefault(
                                                item._id
                                            )
                                        }
                                    >
                                        Set as Default
                                    </button>
                                )}

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Addresses;