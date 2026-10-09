import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import "../App.css";


const API_URL = process.env.REACT_APP_API_URL;


function ResetPassword() {

    const { token } = useParams();

    const navigate = useNavigate();


    // ======================================================
    // FORM STATES
    // ======================================================

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // ======================================================
    // UI STATES
    // ======================================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ======================================================
    // HANDLE RESET
    // ======================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ==================================================
        // TOKEN CHECK
        // ==================================================

        if (!token) {

            setError(
                "Invalid password reset link."
            );

            return;
        }


        // ==================================================
        // EMPTY PASSWORD CHECK
        // ==================================================

        if (
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "Please enter and confirm your new password."
            );

            return;
        }


        // ==================================================
        // PASSWORD LENGTH
        // ==================================================

        if (newPassword.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        // ==================================================
        // PASSWORD MATCH
        // ==================================================

        if (
            newPassword !== confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            // ==================================================
            // API REQUEST
            // ==================================================

            const response = await fetch(
                `${API_URL}/users/reset-password/${token}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        newPassword
                    })
                }
            );


            const result =
                await response.json();


            // ==================================================
            // API ERROR
            // ==================================================

            if (
                !response.ok ||
                result.status === false
            ) {

                setError(
                    result.message ||
                    "Unable to reset password."
                );

                return;
            }


            // ==================================================
            // SUCCESS
            // ==================================================

            setSuccess(
                result.message ||
                "Password reset successfully."
            );


            setNewPassword("");

            setConfirmPassword("");


            // ==================================================
            // REDIRECT TO LOGIN
            // ==================================================

            setTimeout(() => {

                navigate("/login");

            }, 2000);


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            setError(
                "Unable to connect to the server."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="reset-password-page">


            <div className="reset-password-card">


                {/* ==================================================
                    ICON
                ================================================== */}

                <div className="reset-password-logo">
                    🔐
                </div>


                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="reset-password-brand">
                    SHOPNEST
                </div>


                {/* ==================================================
                    TITLE
                ================================================== */}

                <h1>
                    Reset Password
                </h1>


                <p className="reset-password-subtitle">
                    Create a new secure password
                    for your ShopNest account.
                </p>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="reset-password-error">

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* ==================================================
                    SUCCESS
                ================================================== */}

                {success && (

                    <div className="reset-password-success">

                        <span>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    className="reset-password-form"
                    onSubmit={handleSubmit}
                >


                    {/* ==================================================
                        NEW PASSWORD
                    ================================================== */}

                    <div className="reset-password-group">

                        <label htmlFor="newPassword">
                            New Password
                        </label>


                        <div className="reset-password-input">

                            <span>
                                🔒
                            </span>


                            <input
                                id="newPassword"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="reset-password-toggle"
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        CONFIRM PASSWORD
                    ================================================== */}

                    <div className="reset-password-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>


                        <div className="reset-password-input">

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
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="reset-password-toggle"
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        PASSWORD REQUIREMENT
                    ================================================== */}

                    <div className="reset-password-hint">
                        Password must contain at least
                        6 characters.
                    </div>


                    {/* ==================================================
                        SUBMIT
                    ================================================== */}

                    <button
                        type="submit"
                        className="reset-password-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password →"}

                    </button>


                </form>


                {/* ==================================================
                    BACK TO LOGIN
                ================================================== */}

                <div className="reset-password-footer">

                    Remember your password?

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>


                <Link
                    to="/login"
                    className="reset-password-back"
                >
                    ← Back to Login
                </Link>


            </div>

        </div>

    );

}


export default ResetPassword;