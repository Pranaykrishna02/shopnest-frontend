import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/Context";
import { useCart } from "../context/CartContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const { currentUser, isLoggedIn, logout } = useAppContext();
    const { cartItems } = useCart();

    const totalItems = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* Logo */}
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

                {/* Desktop Navigation */}
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
                            {totalItems}
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

                    {isLoggedIn && (
                        <Link
                            to="/addresses"
                            className="nav-link"
                        >
                            Addresses
                        </Link>
                    )}

                </div>

                {/* Desktop User Section */}
                <div className="desktop-user">

                    {isLoggedIn ? (
                        <>
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

                            <button
                                className="desktop-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
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

                {/* Hamburger Button */}
                <button
                    className={`hamburger ${
                        menuOpen ? "active" : ""
                    }`}
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

            </div>

            {/* Mobile Menu */}
            <div
                className={`mobile-menu ${
                    menuOpen ? "open" : ""
                }`}
            >

                {/* Mobile User */}
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

                {/* Home */}
                <Link
                    to="/"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>⌂</span>
                    Home
                </Link>

                {/* Products */}
                <Link
                    to="/products"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>▦</span>
                    Products
                </Link>

                {/* Cart */}
                <Link
                    to="/cart"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>🛒</span>
                    Cart

                    <span className="mobile-cart-badge">
                        {totalItems}
                    </span>
                </Link>

                {/* My Orders */}
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

                {/* Addresses */}
                {isLoggedIn && (
                    <Link
                        to="/addresses"
                        className="mobile-nav-link"
                        onClick={closeMenu}
                    >
                        <span>📍</span>
                        Addresses
                    </Link>
                )}

                <div className="mobile-menu-divider"></div>

                {/* Logged In */}
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
                        {/* Login */}
                        <Link
                            to="/login"
                            className="mobile-nav-link"
                            onClick={closeMenu}
                        >
                            <span>🔑</span>
                            Login
                        </Link>

                        {/* Register */}
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