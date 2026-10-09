import { useState } from "react";
import { Link } from "react-router-dom";

import "../App.css";

const API_URL = process.env.REACT_APP_API_URL;

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [resetUrl, setResetUrl] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setResetUrl("");


        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_URL}/users/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim()
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
                    "Unable to process request."
                );

            }


            setSuccess(
                result.message ||
                "Password reset instructions have been generated."
            );


            if (result.resetUrl) {

                setResetUrl(
                    result.resetUrl
                );

            }


        } catch (error) {

            setError(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="forgot-password-page">


            <div className="forgot-password-card">


                {/* LOGO */}

                <div className="forgot-password-logo">
                    🛍️
                </div>


                {/* BRAND */}

                <div className="forgot-password-brand">
                    SHOPNEST
                </div>


                {/* TITLE */}

                <h1>
                    Forgot Password?
                </h1>


                <p className="forgot-password-subtitle">
                    Enter your registered email address
                    and we'll help you reset your password.
                </p>


                {/* ERROR */}

                {error && (

                    <div className="forgot-password-error">

                        <span>!</span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div className="forgot-password-success">

                        <span>✓</span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="forgot-password-form"
                >


                    <label htmlFor="forgotEmail">
                        Email Address
                    </label>


                    <div className="forgot-password-input">

                        <span>
                            ✉
                        </span>


                        <input
                            id="forgotEmail"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="forgot-password-button"
                    >

                        {loading
                            ? "Sending..."
                            : "Send Reset Link →"}

                    </button>


                </form>


                {/* RESET URL */}

                {resetUrl && (

                    <div className="reset-url-box">

                        <div className="reset-url-title">
                            🔗 Password Reset Link
                        </div>


                        <p>
                            Development mode:
                        </p>


                        <a
                            href={resetUrl}
                            className="reset-url-link"
                        >
                            {resetUrl}
                        </a>

                    </div>

                )}


                {/* BACK TO LOGIN */}

                <div className="forgot-password-footer">

                    Remember your password?

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>


                <Link
                    to="/login"
                    className="forgot-back-link"
                >
                    ← Back to Login
                </Link>


            </div>

        </div>

    );

}

export default ForgotPassword;