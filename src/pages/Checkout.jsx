import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAppContext } from "../context/Context";

const API_URL = process.env.REACT_APP_API_URL;

function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        cartTotal,
        loading,
        error,
        refreshCart
    } = useCart();

    const { currentUser } = useAppContext();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [paymentMethod, setPaymentMethod] = useState(
        "Cash on Delivery"
    );

    const [errors, setErrors] = useState({});
    const [orderError, setOrderError] = useState("");
    const [placingOrder, setPlacingOrder] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: ""
        }));

        setOrderError("");
    };

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);

        setErrors((currentErrors) => ({
            ...currentErrors,
            paymentMethod: ""
        }));

        setOrderError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone =
                "Phone number must contain 10 digits";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            newErrors.pincode =
                "Pincode must contain 6 digits";
        }

        if (!paymentMethod) {
            newErrors.paymentMethod =
                "Please select a payment method";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setOrderError("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        if (!currentUser?.userId) {
            setOrderError(
                "User information is not available. Please login again."
            );
            return;
        }

        if (cartItems.length === 0) {
            setOrderError("Your cart is empty");
            return;
        }

        try {
            setPlacingOrder(true);

            const shippingAddress = [
                formData.fullName.trim(),
                formData.phone.trim(),
                formData.address.trim(),
                formData.city.trim(),
                formData.state.trim(),
                formData.pincode.trim()
            ].join(", ");

            const response = await fetch(
                `${API_URL}/order`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            userId: currentUser.userId,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod
        })
    }
);
        

            const result = await response.json();

            console.log(
                "Order API response:",
                result
            );

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to create order"
                );
            }

            const orderId = result.data?._id;

            if (!orderId) {
                throw new Error(
                    "Order created but Order ID was not returned"
                );
            }

            await refreshCart();

            navigate(
                `/order-confirmation/${orderId}`
            );
        } catch (error) {
            console.log(
                "Order creation error:",
                error.message
            );

            setOrderError(error.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <h1>Checkout</h1>

                <div className="checkout-message">
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="checkout-page">
                <h1>Checkout</h1>

                <div className="checkout-message checkout-error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <h1>Checkout</h1>

                <div className="empty-checkout">
                    <h2>Your Cart is Empty</h2>

                    <p>
                        Add products to your cart
                        before proceeding to checkout.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            <div className="checkout-header">
                <h1>Checkout</h1>

                <p>
                    Complete your order by providing
                    your delivery and payment details.
                </p>
            </div>

            {orderError && (
                <div className="checkout-order-error">
                    {orderError}
                </div>
            )}

            <form
                className="checkout-content"
                onSubmit={handleSubmit}
            >

                <div className="checkout-section delivery-section">

                    <div className="section-heading">
                        <span className="section-number">
                            01
                        </span>

                        <div>
                            <h2>Delivery Details</h2>

                            <p>
                                Enter your delivery information
                            </p>
                        </div>
                    </div>

                    <div className="checkout-form">

                        <div className="form-row">

                            <div className="form-group">
                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />

                                {errors.fullName && (
                                    <p className="field-error">
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10 digit phone number"
                                    maxLength="10"
                                />

                                {errors.phone && (
                                    <p className="field-error">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                        </div>

                        <div className="form-group">
                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your complete delivery address"
                            />

                            {errors.address && (
                                <p className="field-error">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                />

                                {errors.city && (
                                    <p className="field-error">
                                        {errors.city}
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                />

                                {errors.state && (
                                    <p className="field-error">
                                        {errors.state}
                                    </p>
                                )}
                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="6 digit pincode"
                                maxLength="6"
                            />

                            {errors.pincode && (
                                <p className="field-error">
                                    {errors.pincode}
                                </p>
                            )}

                        </div>

                    </div>
                </div>

                <div className="checkout-section payment-section">

                    <div className="section-heading">
                        <span className="section-number">
                            02
                        </span>

                        <div>
                            <h2>Payment</h2>

                            <p>
                                Select your preferred payment method
                            </p>
                        </div>
                    </div>

                    <div className="payment-options">

                        <label
                            className={`payment-option ${
                                paymentMethod ===
                                "Cash on Delivery"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash on Delivery"
                                checked={
                                    paymentMethod ===
                                    "Cash on Delivery"
                                }
                                onChange={
                                    handlePaymentChange
                                }
                            />

                            <div className="payment-option-content">
                                <div className="payment-title">
                                    Cash on Delivery
                                </div>

                                <div className="payment-description">
                                    Pay when your order arrives
                                </div>
                            </div>
                        </label>

                        <label
                            className={`payment-option ${
                                paymentMethod === "UPI"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={
                                    paymentMethod === "UPI"
                                }
                                onChange={
                                    handlePaymentChange
                                }
                            />

                            <div className="payment-option-content">
                                <div className="payment-title">
                                    UPI
                                </div>

                                <div className="payment-description">
                                    Pay securely using UPI
                                </div>
                            </div>
                        </label>

                        <label
                            className={`payment-option ${
                                paymentMethod === "Card"
                                    ? "selected"
                                    : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Card"
                                checked={
                                    paymentMethod === "Card"
                                }
                                onChange={
                                    handlePaymentChange
                                }
                            />

                            <div className="payment-option-content">
                                <div className="payment-title">
                                    Credit / Debit Card
                                </div>

                                <div className="payment-description">
                                    Pay securely using your card
                                </div>
                            </div>
                        </label>

                    </div>

                    {errors.paymentMethod && (
                        <p className="field-error">
                            {errors.paymentMethod}
                        </p>
                    )}

                </div>

                <div className="checkout-section review-section">

                    <div className="section-heading">

                        <span className="section-number">
                            03
                        </span>

                        <div>
                            <h2>Review Order</h2>

                            <p>
                                Check your order before placing it
                            </p>
                        </div>

                    </div>

                    <div className="review-items">

                        {cartItems.map((item) => (

                            <div
                                className="review-item"
                                key={item._id}
                            >

                                <div className="review-product-image">

                                    <img
                                        src={
                                            item.productId?.image ||
                                            "https://via.placeholder.com/100?text=No+Image"
                                        }
                                        alt={
                                            item.productId?.name ||
                                            "Product"
                                        }
                                    />

                                </div>

                                <div className="review-product-info">

                                    <h3>
                                        {item.productId?.name ||
                                            "Product"}
                                    </h3>

                                    <p>
                                        ₹{item.price} ×{" "}
                                        {item.quantity}
                                    </p>

                                </div>

                                <div className="review-product-total">
                                    ₹{item.itemTotal}
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="review-summary">

                        <div className="summary-row">
                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹{cartTotal}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>
                                Delivery
                            </span>

                            <span className="free-text">
                                FREE
                            </span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>
                                Grand Total
                            </span>

                            <strong>
                                ₹{cartTotal}
                            </strong>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="place-order-button"
                        disabled={placingOrder}
                    >
                        {placingOrder
                            ? "Placing Order..."
                            : "Place Order"}
                    </button>

                    <p className="secure-checkout">
                        Your order information is securely processed.
                    </p>

                </div>

            </form>

        </div>
    );
}

export default Checkout;