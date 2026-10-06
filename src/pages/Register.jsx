import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));

        setApiError("");
        setSuccess(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone =
                "Phone number must be 10 digits";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password";
        } else if (
            formData.password !==
            formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess(false);
        setApiError("");

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Registration failed"
                );
            }

            setSuccess(true);

            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: ""
            });
        } catch (error) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-box">

                {/* =========================
                    LEFT PROMOTIONAL SECTION
                ========================== */}

                <div className="register-promo">

                    <div className="register-promo-content">

                        <div className="register-promo-logo">
                            🛍️
                        </div>

                        <span className="register-promo-label">
                            WELCOME TO SHOP NEST
                        </span>

                        <h2>
                            Shop Smarter.
                            <br />
                            Live Better.
                        </h2>

                        <p>
                            Discover great products,
                            exclusive deals and a
                            simple shopping experience
                            designed just for you.
                        </p>

                        <div className="register-promo-features">

                            <div className="promo-feature">
                                <span>✓</span>
                                <div>
                                    <strong>
                                        Best Deals
                                    </strong>
                                    <small>
                                        Great products at great prices
                                    </small>
                                </div>
                            </div>

                            <div className="promo-feature">
                                <span>✓</span>
                                <div>
                                    <strong>
                                        Secure Shopping
                                    </strong>
                                    <small>
                                        Your information stays protected
                                    </small>
                                </div>
                            </div>

                            <div className="promo-feature">
                                <span>✓</span>
                                <div>
                                    <strong>
                                        Fast Delivery
                                    </strong>
                                    <small>
                                        Quick and reliable delivery
                                    </small>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="promo-decoration promo-decoration-one"></div>
                    <div className="promo-decoration promo-decoration-two"></div>

                </div>

                {/* =========================
                    RIGHT REGISTER FORM
                ========================== */}

                <div className="register-form-section">

                    <div className="register-form-content">

                        {/* BRAND */}

                        <div className="register-brand">

                            <div className="register-brand-icon">
                                🛍
                            </div>

                            <div>
                                <h2>
                                    Shop <span>Nest</span>
                                </h2>

                                <p>
                                    Everything You Need,
                                    One Place
                                </p>
                            </div>

                        </div>

                        <h1>
                            Create Account
                        </h1>

                        <p className="register-subtitle">
                            Join us and start your
                            shopping journey!
                        </p>

                        {/* API ERROR */}

                        {apiError && (
                            <div className="register-api-error">
                                {apiError}
                            </div>
                        )}

                        {/* SUCCESS */}

                        {success && (
                            <div className="register-success">
                                Registration successful!
                                Your account has been created.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* NAME */}

                            <div className="register-input-group">

                                <label htmlFor="name">
                                    Name
                                </label>

                                <div className="register-input-wrapper">

                                    <span>
                                        👤
                                    </span>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {errors.name && (
                                    <p className="register-error">
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            {/* EMAIL */}

                            <div className="register-input-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <div className="register-input-wrapper">

                                    <span>
                                        ✉
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                                {errors.email && (
                                    <p className="register-error">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* PHONE */}

                            <div className="register-input-group">

                                <label htmlFor="phone">
                                    Phone
                                </label>

                                <div className="register-input-wrapper">

                                    <span>
                                        📱
                                    </span>

                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter 10-digit phone number"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={10}
                                    />

                                </div>

                                {errors.phone && (
                                    <p className="register-error">
                                        {errors.phone}
                                    </p>
                                )}

                            </div>

                            {/* PASSWORD */}

                            <div className="register-input-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="register-input-wrapper">

                                    <span>
                                        🔒
                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="register-password-button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                {errors.password && (
                                    <p className="register-error">
                                        {errors.password}
                                    </p>
                                )}

                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="register-input-group">

                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <div className="register-input-wrapper">

                                    <span>
                                        🔒
                                    </span>

                                    <input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="register-password-button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                                {errors.confirmPassword && (
                                    <p className="register-error">
                                        {
                                            errors.confirmPassword
                                        }
                                    </p>
                                )}

                            </div>

                            {/* CREATE ACCOUNT */}

                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "CREATE ACCOUNT"}
                            </button>

                        </form>

                        {/* LOGIN */}

                        <p className="register-login-text">

                            Already have an account?{" "}

                            <Link to="/login">
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;