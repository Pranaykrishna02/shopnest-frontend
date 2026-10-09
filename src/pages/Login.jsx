import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAppContext } from "../context/Context";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
    const navigate = useNavigate();

    const { login } = useAppContext();

    // ======================================================
    // FORM DATA
    // ======================================================

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // ======================================================
    // STATES
    // ======================================================

    const [errors, setErrors] = useState({});

    const [success, setSuccess] = useState(false);

    const [apiError, setApiError] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    // ======================================================
    // HANDLE INPUT CHANGE
    // ======================================================

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: ""
        }));

        setSuccess(false);

        setApiError("");
    };

    // ======================================================
    // FORM VALIDATION
    // ======================================================

    const validateForm = () => {
        const newErrors = {};

        // EMAIL

        if (!formData.email.trim()) {
            newErrors.email =
                "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            newErrors.email =
                "Please enter a valid email address";
        }

        // PASSWORD

        if (!formData.password) {
            newErrors.password =
                "Password is required";
        } else if (
            formData.password.length < 6
        ) {
            newErrors.password =
                "Password must contain at least 6 characters";
        }

        return newErrors;
    };

    // ======================================================
    // HANDLE LOGIN
    // ======================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors =
            validateForm();

        if (
            Object.keys(validationErrors).length > 0
        ) {
            setErrors(validationErrors);
            setSuccess(false);
            setApiError("");
            return;
        }

        try {
            setLoading(true);
            setApiError("");
            setSuccess(false);

            const response = await fetch(
                `${API_URL}/users/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email:
                            formData.email,
                        password:
                            formData.password
                    })
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                result.status === false
            ) {
                throw new Error(
                    result.message ||
                    "Login failed"
                );
            }

            // ==================================================
            // GET USER DATA FROM TOKEN
            // ==================================================

            const tokenData =
                JSON.parse(
                    atob(
                        result.token.split(".")[1]
                    )
                );

            const user = {
                userId:
                    tokenData.userId,

                email:
                    tokenData.email,

                role:
                    result.role
            };

            // ==================================================
            // SAVE LOGIN
            // ==================================================

            login(
                result.token,
                user
            );

            setErrors({});
            setApiError("");
            setSuccess(true);

            // ==================================================
            // REDIRECT
            // ==================================================

            if (
                result.role === "admin"
            ) {
                navigate("/admin");
            } else {
                navigate("/products");
            }

        } catch (error) {
            setSuccess(false);

            setApiError(
                error.message
            );

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="login-page">

            <div className="login-box">

                {/* ==================================================
                    LEFT SIDE
                ================================================== */}

                <div className="login-welcome">

                    <div className="login-welcome-shape login-shape-one"></div>

                    <div className="login-welcome-shape login-shape-two"></div>

                    <div className="welcome-content">

                        <div className="login-brand-mark">
                            🛍️
                        </div>

                        <span className="login-welcome-label">
                            WELCOME TO SHOPNEST
                        </span>

                        <h1>
                            Shop Smarter.
                            <br />
                            Live Better.
                        </h1>

                        <p>
                            Discover great products,
                            exclusive deals and a simple
                            shopping experience made for you.
                        </p>

                        <div className="login-benefits">

                            {/* BEST DEALS */}

                            <div className="login-benefit">

                                <span>
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Best Deals
                                    </strong>

                                    <small>
                                        Great products at great prices
                                    </small>

                                </div>

                            </div>

                            {/* SECURE SHOPPING */}

                            <div className="login-benefit">

                                <span>
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Secure Shopping
                                    </strong>

                                    <small>
                                        Your information stays protected
                                    </small>

                                </div>

                            </div>

                            {/* FAST DELIVERY */}

                            <div className="login-benefit">

                                <span>
                                    ✓
                                </span>

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

                </div>

                {/* ==================================================
                    RIGHT SIDE
                ================================================== */}

                <div className="login-form-section">

                    <div className="login-form-content">

                        {/* MOBILE BRAND */}

                        <div className="login-mobile-brand">
                            🛍️
                        </div>

                        <span className="login-form-label">
                            SHOPNEST
                        </span>

                        <h1>
                            Welcome Back
                        </h1>

                        <p className="login-subtitle">
                            Sign in to continue shopping
                        </p>

                        <form onSubmit={handleSubmit}>

                            {/* ==================================================
                                EMAIL
                            ================================================== */}

                            <div className="login-input-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div
                                    className={`login-input-wrapper ${
                                        errors.email
                                            ? "login-input-error"
                                            : ""
                                    }`}
                                >

                                    <span className="login-input-icon">
                                        ✉
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />

                                </div>

                                {errors.email && (
                                    <p className="login-error">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* ==================================================
                                PASSWORD
                            ================================================== */}

                            <div className="login-input-group">

                                {/* PASSWORD LABEL + FORGOT PASSWORD */}

                                <div className="login-label-row">

                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <Link
                                        to="/reset-password"
                                        className="forgot-password-link"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>

                                <div
                                    className={`login-input-wrapper ${
                                        errors.password
                                            ? "login-input-error"
                                            : ""
                                    }`}
                                >

                                    <span className="login-input-icon">
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
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />

                                    <button
                                        type="button"
                                        className="login-password-button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {
                                            showPassword
                                                ? "🙈"
                                                : "👁"
                                        }
                                    </button>

                                </div>

                                {errors.password && (
                                    <p className="login-error">
                                        {errors.password}
                                    </p>
                                )}

                            </div>

                            {/* ==================================================
                                API ERROR
                            ================================================== */}

                            {apiError && (
                                <div className="login-api-error">

                                    <span>
                                        !
                                    </span>

                                    {apiError}

                                </div>
                            )}

                            {/* ==================================================
                                SUCCESS
                            ================================================== */}

                            {success && (
                                <div className="login-success">
                                    ✓ Login successful!
                                </div>
                            )}

                            {/* ==================================================
                                LOGIN BUTTON
                            ================================================== */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>

                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In

                                        <span>
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>

                        {/* ==================================================
                            REGISTER
                        ================================================== */}

                        <p className="register-text">

                            Don't have an account?{" "}

                            <Link to="/register">
                                Create Account
                            </Link>

                        </p>

                        {/* ==================================================
                            SECURITY
                        ================================================== */}

                        <div className="login-security">

                            🔒 Secure
                            &nbsp; • &nbsp;
                            Private
                            &nbsp; • &nbsp;
                            Reliable

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;