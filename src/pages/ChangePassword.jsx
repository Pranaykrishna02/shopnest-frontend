import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAppContext } from "../context/Context";

function ChangePassword() {
    const navigate = useNavigate();

    const {
        isLoggedIn
    } = useAppContext();

    const API_URL =
        process.env.REACT_APP_API_URL;

    // ======================================================
    // FORM STATES
    // ======================================================

    const [
        currentPassword,
        setCurrentPassword
    ] = useState("");

    const [
        newPassword,
        setNewPassword
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword
    ] = useState("");

    // ======================================================
    // PASSWORD VISIBILITY
    // ======================================================

    const [
        showCurrentPassword,
        setShowCurrentPassword
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] = useState(false);

    // ======================================================
    // STATUS
    // ======================================================

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const [
        success,
        setSuccess
    ] = useState("");

    // ======================================================
    // AUTHENTICATION CHECK
    // ======================================================

    if (!isLoggedIn) {
        navigate("/login");
        return null;
    }

    // ======================================================
    // HANDLE SUBMIT
    // ======================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // --------------------------------------------------
        // REQUIRED FIELDS
        // --------------------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError(
                "Please fill in all password fields."
            );

            return;
        }

        // --------------------------------------------------
        // PASSWORD LENGTH
        // --------------------------------------------------

        if (newPassword.length < 6) {
            setError(
                "New password must contain at least 6 characters."
            );

            return;
        }

        // --------------------------------------------------
        // PASSWORD MATCH
        // --------------------------------------------------

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "New password and confirm password do not match."
            );

            return;
        }

        // --------------------------------------------------
        // PASSWORD DIFFERENCE
        // --------------------------------------------------

        if (
            currentPassword ===
            newPassword
        ) {
            setError(
                "New password must be different from your current password."
            );

            return;
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/users/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                setError(
                    result.message ||
                    "Unable to change password."
                );

                return;
            }

            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            setSuccess(
                result.message ||
                "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Redirect after success
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            console.error(
                "Change password error:",
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
        <div className="password-page">

            <div className="password-card">

                {/* ==================================================
                    HEADER ICON
                ================================================== */}

                <div className="password-logo">
                    🔐
                </div>

                <div className="password-brand">
                    SHOPNEST
                </div>

                <h1>
                    Change Password
                </h1>

                <p className="password-description">
                    Update your account password.
                    Make sure your new password is
                    secure and easy for you to remember.
                </p>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="password-form"
                >

                    {/* ==================================================
                        CURRENT PASSWORD
                    ================================================== */}

                    <div className="password-input-group">

                        <label
                            htmlFor="currentPassword"
                        >
                            Current Password
                        </label>

                        <div className="password-field">

                            <span className="password-field-icon">
                                🔒
                            </span>

                            <input
                                id="currentPassword"
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter current password"
                                value={
                                    currentPassword
                                }
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                                aria-label={
                                    showCurrentPassword
                                        ? "Hide current password"
                                        : "Show current password"
                                }
                            >
                                {showCurrentPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        NEW PASSWORD
                    ================================================== */}

                    <div className="password-input-group">

                        <label
                            htmlFor="newPassword"
                        >
                            New Password
                        </label>

                        <div className="password-field">

                            <span className="password-field-icon">
                                🔒
                            </span>

                            <input
                                id="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter new password"
                                value={
                                    newPassword
                                }
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                                aria-label={
                                    showNewPassword
                                        ? "Hide new password"
                                        : "Show new password"
                                }
                            >
                                {showNewPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                        <div className="password-hint">
                            Use at least 6 characters.
                        </div>

                    </div>


                    {/* ==================================================
                        CONFIRM PASSWORD
                    ================================================== */}

                    <div className="password-input-group">

                        <label
                            htmlFor="confirmPassword"
                        >
                            Confirm New Password
                        </label>

                        <div className="password-field">

                            <span className="password-field-icon">
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
                                value={
                                    confirmPassword
                                }
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="password-error">

                            <span className="password-message-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>
                    )}


                    {/* ==================================================
                        SUCCESS
                    ================================================== */}

                    {success && (
                        <div className="password-success">

                            <span className="password-message-icon">
                                ✓
                            </span>

                            <span>
                                {success}
                            </span>

                        </div>
                    )}


                    {/* ==================================================
                        SUBMIT BUTTON
                    ================================================== */}

                    <button
                        type="submit"
                        className="password-submit-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="password-spinner"></span>

                                Updating...
                            </>
                        ) : (
                            <>
                                Change Password

                                <span>
                                    →
                                </span>
                            </>
                        )}
                    </button>

                </form>


                {/* ==================================================
                    BACK LINK
                ================================================== */}

                <div className="password-back">

                    <Link to="/">
                        ← Back to Home
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ChangePassword;