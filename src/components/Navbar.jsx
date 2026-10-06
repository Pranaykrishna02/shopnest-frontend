import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        closeMenu();
        window.location.href = "/login";
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
                    <span className="logo-icon">🛍️</span>
                    <span>ShopNest</span>
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
                        <span className="cart-badge">0</span>
                    </Link>

                    <Link
                        to="/orders"
                        className="nav-link"
                    >
                        My Orders
                    </Link>

                </div>

                {/* User Section */}
                <div className="desktop-user">

                    <div className="user-avatar">
                        👤
                    </div>

                    <div className="user-details">
                        <span className="user-email">
                            user@email.com
                        </span>

                        <span className="user-role">
                            Customer
                        </span>
                    </div>

                    <button
                        className="desktop-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

                {/* Hamburger */}
                <button
                    className={`hamburger ${
                        menuOpen ? "active" : ""
                    }`}
                    onClick={() => setMenuOpen(!menuOpen)}
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

                <div className="mobile-user">

                    <div className="mobile-user-avatar">
                        👤
                    </div>

                    <div>
                        <div className="mobile-user-email">
                            user@email.com
                        </div>

                        <div className="mobile-user-role">
                            Customer
                        </div>
                    </div>

                </div>

                {/* Mobile Links */}

                <Link
                    to="/"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>⌂</span>
                    Home
                </Link>

                <Link
                    to="/products"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>▦</span>
                    Products
                </Link>

                <Link
                    to="/cart"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>🛒</span>
                    Cart
                    <span className="mobile-cart-badge">
                        0
                    </span>
                </Link>

                <Link
                    to="/orders"
                    className="mobile-nav-link"
                    onClick={closeMenu}
                >
                    <span>📦</span>
                    My Orders
                </Link>

                <div className="mobile-menu-divider"></div>

                <button
                    className="mobile-logout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;