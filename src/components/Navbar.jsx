import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";
import { useCart } from "../context/CartContext";

function Navbar() {
    const navigate = useNavigate();

    const {
        currentUser,
        isLoggedIn,
        logout
    } = useAppContext();

    const {
        cartCount
    } = useCart();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-logo">
                <Link to="/">
                    Shop<span>Nest</span>
                </Link>
            </div>

            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                {isLoggedIn &&
                    currentUser?.role === "customer" && (
                        <>
                            <Link to="/cart">
                                Cart ({cartCount})
                            </Link>

                            <Link to="/orders">
                                My Orders
                            </Link>
                        </>
                    )}

                {isLoggedIn ? (
                    <>
                        <span className="navbar-user">
                            {currentUser?.email}
                        </span>

                        <span className="navbar-role">
                            {currentUser?.role}
                        </span>

                        <button
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register">
                            Register
                        </Link>

                        <Link to="/login">
                            Login
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;