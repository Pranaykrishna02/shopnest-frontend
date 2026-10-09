import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/Context";
import { useCart } from "../context/CartContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);

    const {
        currentUser,
        isLoggedIn,
        logout
    } = useAppContext();

    const {
        cartItems = []
    } = useCart();

    // ======================================================
    // CART COUNT
    // ======================================================

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    // ======================================================
    // CLOSE MENU
    // ======================================================

    const closeMenu = () => {
        setMenuOpen(false);
        setAccountOpen(false);
    };

    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    // ======================================================
    // ACCOUNT TOGGLE
    // ======================================================

    const toggleAccount = () => {
        setAccountOpen(
            (currentState) => !currentState
        );
    };

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* ==================================================
                    LOGO
                ================================================== */}

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    <span className="logo-icon">
                        🛍️
                    </span>

                    <span>
                        ShopNest
                    </span>
                </Link>


                {/* ==================================================
                    DESKTOP NAVIGATION
                ================================================== */}

                <div className="desktop-nav">

                    <Link
                        to="/"
                        className="nav-link"
                    >
                        Home
                    </Link>

                    <Link
                        to="/products"
                        className="nav-link"
                    >
                        Products
                    </Link>

                    <Link
                        to="/cart"
                        className="nav-link cart-link"
                    >
                        🛒 Cart

                        <span className="cart-badge">
                            {cartCount}
                        </span>
                    </Link>

                    {isLoggedIn && (
                        <Link
                            to="/orders"
                            className="nav-link"
                        >
                            My Orders
                        </Link>
                    )}

                </div>


                {/* ==================================================
                    DESKTOP USER
                ================================================== */}

                <div className="desktop-user">

                    {isLoggedIn ? (
                        <div className="account-wrapper">

                            {/* ACCOUNT BUTTON */}

                            <button
                                type="button"
                                className="account-button"
                                onClick={toggleAccount}
                                aria-expanded={
                                    accountOpen
                                }
                                aria-label="Open account menu"
                            >

                                <div className="user-avatar">
                                    👤
                                </div>

                                <div className="user-details">

                                    <span className="user-email">
                                        {currentUser?.email}
                                    </span>

                                    <span className="user-role">
                                        {currentUser?.role}
                                    </span>

                                </div>

                                <span
                                    className={`account-arrow ${
                                        accountOpen
                                            ? "open"
                                            : ""
                                    }`}
                                >
                                    ▾
                                </span>

                            </button>


                            {/* ACCOUNT DROPDOWN */}

                            {accountOpen && (
                                <div className="account-dropdown">

                                    {/* ACCOUNT HEADER */}

                                    <div className="account-dropdown-header">

                                        <div className="account-dropdown-avatar">
                                            👤
                                        </div>

                                        <div className="account-dropdown-user">

                                            <strong>
                                                {currentUser?.email}
                                            </strong>

                                            <span>
                                                {currentUser?.role}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="account-dropdown-divider"></div>


                                    {/* MY ORDERS */}

                                    <Link
                                        to="/orders"
                                        className="account-dropdown-item"
                                        onClick={
                                            closeMenu
                                        }
                                    >
                                        <span className="account-item-icon">
                                            📦
                                        </span>

                                        <span>
                                            My Orders
                                        </span>
                                    </Link>


                                    {/* MANAGE ADDRESSES */}

                                    <Link
                                        to="/addresses"
                                        className="account-dropdown-item"
                                        onClick={
                                            closeMenu
                                        }
                                    >
                                        <span className="account-item-icon">
                                            📍
                                        </span>

                                        <span>
                                            Manage Addresses
                                        </span>
                                    </Link>


                                    {/* CHANGE PASSWORD */}

                                    <Link
                                        to="/change-password"
                                        className="account-dropdown-item"
                                        onClick={
                                            closeMenu
                                        }
                                    >
                                        <span className="account-item-icon">
                                            🔐
                                        </span>

                                        <span>
                                            Change Password
                                        </span>
                                    </Link>


                                    <div className="account-dropdown-divider"></div>


                                    {/* LOGOUT */}

                                    <button
                                        type="button"
                                        className="account-dropdown-logout"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <span className="account-item-icon">
                                            ↪
                                        </span>

                                        <span>
                                            Logout
                                        </span>
                                    </button>

                                </div>
                            )}

                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nav-auth-link"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="nav-register-btn"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>


                {/* ==================================================
                    MOBILE HAMBURGER
                ================================================== */}

                <button
                    className={`hamburger ${
                        menuOpen ? "active" : ""
                    }`}
                    onClick={() =>
                        setMenuOpen(
                            !menuOpen
                        )
                    }
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

            </div>


            {/* ==================================================
                MOBILE MENU
            ================================================== */}

            <div
                className={`mobile-menu ${
                    menuOpen ? "open" : ""
                }`}
            >

                {/* MOBILE USER */}

                {isLoggedIn && (
                    <div className="mobile-user">

                        <div className="mobile-user-avatar">
                            👤
                        </div>

                        <div>

                            <div className="mobile-user-email">
                                {currentUser?.email}
                            </div>

                            <div className="mobile-user-role">
                                {currentUser?.role}
                            </div>

                        </div>

                    </div>
                )}


                {/* HOME */}

                <Link
                    to="/"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>⌂</span>
                    Home
                </Link>


                {/* PRODUCTS */}

                <Link
                    to="/products"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>▦</span>
                    Products
                </Link>


                {/* CART */}

                <Link
                    to="/cart"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>🛒</span>

                    Cart

                    <span className="mobile-cart-badge">
                        {cartCount}
                    </span>
                </Link>


                {/* MY ORDERS */}

                {isLoggedIn && (
                    <Link
                        to="/orders"
                        className="mobile-nav-link"
                        onClick={closeMenu}
                    >
                        <span>📦</span>
                        My Orders
                    </Link>
                )}


                {/* MANAGE ADDRESSES */}

                {isLoggedIn && (
                    <Link
                        to="/addresses"
                        className="mobile-nav-link"
                        onClick={closeMenu}
                    >
                        <span>📍</span>
                        Manage Addresses
                    </Link>
                )}


                {/* CHANGE PASSWORD */}

                {isLoggedIn && (
                    <Link
                        to="/change-password"
                        className="mobile-nav-link"
                        onClick={closeMenu}
                    >
                        <span>🔐</span>
                        Change Password
                    </Link>
                )}


                <div className="mobile-menu-divider"></div>


                {/* LOGOUT / LOGIN */}

                {isLoggedIn ? (
                    <button
                        className="mobile-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="mobile-nav-link"
                            onClick={closeMenu}
                        >
                            <span>🔑</span>
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="mobile-register-btn"
                            onClick={closeMenu}
                        >
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;