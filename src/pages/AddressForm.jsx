import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/Context";

const API_URL = process.env.REACT_APP_API_URL;

function AddressForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { currentUser } = useAppContext();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState("");

    /* =====================================================
       LOAD ADDRESS FOR EDIT
    ===================================================== */

    useEffect(() => {
        if (!isEditMode || !currentUser?.userId) {
            setFetching(false);
            return;
        }

        const fetchAddress = async () => {
            try {
                setFetching(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/address/user/${currentUser.userId}`
                );

                const result = await response.json();

                if (!response.ok || !result.status) {
                    throw new Error(
                        result.message ||
                        "Failed to load address"
                    );
                }

                const address = (result.data || []).find(
                    (item) => item._id === id
                );

                if (!address) {
                    throw new Error("Address not found");
                }

                setFormData({
                    fullName: address.fullName || "",
                    phone: address.phone || "",
                    address: address.address || "",
                    city: address.city || "",
                    state: address.state || "",
                    pincode: address.pincode || "",
                    isDefault: Boolean(address.isDefault)
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setFetching(false);
            }
        };

        fetchAddress();
    }, [id, isEditMode, currentUser]);

    /* =====================================================
       HANDLE INPUT
    ===================================================== */

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return "Full name is required";
        }

        if (!formData.phone.trim()) {
            return "Phone number is required";
        }

        if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            return "Enter a valid 10-digit phone number";
        }

        if (!formData.address.trim()) {
            return "Address is required";
        }

        if (!formData.city.trim()) {
            return "City is required";
        }

        if (!formData.state.trim()) {
            return "State is required";
        }

        if (!formData.pincode.trim()) {
            return "Pincode is required";
        }

        if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
            return "Enter a valid 6-digit pincode";
        }

        return "";
    };

    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (!currentUser?.userId) {
            setError(
                "Please login to manage your addresses"
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = isEditMode
                ? `${API_URL}/address/${id}`
                : `${API_URL}/address/create`;

            const method = isEditMode
                ? "PUT"
                : "POST";

            const payload = {
                userId: currentUser.userId,
                fullName: formData.fullName.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
                isDefault: formData.isDefault
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    `Failed to ${
                        isEditMode
                            ? "update"
                            : "save"
                    } address`
                );
            }

            navigate("/addresses");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (fetching) {
        return (
            <div className="address-form-page">
                <div className="address-form-container">
                    <div className="address-form-loading">
                        Loading address...
                    </div>
                </div>
            </div>
        );
    }

    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <div className="address-form-page">

            <div className="address-form-container">

                {/* Header */}

                <div className="address-form-header">

                    <button
                        type="button"
                        className="back-address-button"
                        onClick={() =>
                            navigate("/addresses")
                        }
                    >
                        ← Back to Addresses
                    </button>

                    <span className="address-form-eyebrow">
                        {isEditMode
                            ? "EDIT ADDRESS"
                            : "NEW ADDRESS"}
                    </span>

                    <h1>
                        {isEditMode
                            ? "Edit your address"
                            : "Add a new address"}
                    </h1>

                    <p>
                        {isEditMode
                            ? "Update your delivery address details."
                            : "Save an address for faster checkout next time."}
                    </p>

                </div>

                {/* Error */}

                {error && (
                    <div className="address-form-error">
                        {error}
                    </div>
                )}

                {/* Form */}

                <form
                    className="address-form-card"
                    onSubmit={handleSubmit}
                >

                    <div className="address-form-grid">

                        {/* Full Name */}

                        <div className="address-form-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />

                        </div>

                        {/* Phone */}

                        <div className="address-form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter 10-digit phone number"
                                maxLength="10"
                            />

                        </div>

                        {/* Address */}

                        <div className="address-form-group full-width">

                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="House number, street, area"
                                rows="4"
                            />

                        </div>

                        {/* City */}

                        <div className="address-form-group">

                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                            />

                        </div>

                        {/* State */}

                        <div className="address-form-group">

                            <label htmlFor="state">
                                State
                            </label>

                            <input
                                id="state"
                                name="state"
                                type="text"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                            />

                        </div>

                        {/* Pincode */}

                        <div className="address-form-group">

                            <label htmlFor="pincode">
                                Pincode
                            </label>

                            <input
                                id="pincode"
                                name="pincode"
                                type="text"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter 6-digit pincode"
                                maxLength="6"
                            />

                        </div>

                    </div>

                    {/* Default Address */}

                    <label className="default-address-checkbox">

                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                        />

                        <span>
                            Make this my default address
                        </span>

                    </label>

                    {/* Buttons */}

                    <div className="address-form-actions">

                        <button
                            type="button"
                            className="cancel-address-button"
                            onClick={() =>
                                navigate("/addresses")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-address-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Address"
                                    : "Save Address"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddressForm;