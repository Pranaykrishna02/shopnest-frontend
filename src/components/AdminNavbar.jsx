import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Context";

function AdminNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        currentUser,
        logout
    } = useAppContext();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(path + "/")
        );
    };

    return (
        <aside className="exact-admin-sidebar">

            <div className="exact-admin-brand">
                <div className="exact-admin-brand-icon">
                    🛍
                </div>

                <div>
                    <strong>ShopNest</strong>
                    <span>Admin Panel</span>
                </div>
            </div>

            <nav className="exact-admin-nav">

                <Link
                    to="/admin"
                    className={
                        isActive("/admin")
                            ? "active"
                            : ""
                    }
                >
                    <span>⌂</span>
                    Dashboard
                </Link>

                <Link
                    to="/admin/products"
                    className={
                        isActive("/admin/products")
                            ? "active"
                            : ""
                    }
                >
                    <span>◆</span>
                    Products
                </Link>

                <Link
                    to="/admin/categories"
                    className={
                        isActive("/admin/categories")
                            ? "active"
                            : ""
                    }
                >
                    <span>▣</span>
                    Categories
                </Link>

                <Link
                    to="/admin/orders"
                    className={
                        isActive("/admin/orders")
                            ? "active"
                            : ""
                    }
                >
                    <span>▤</span>
                    Orders
                </Link>

            </nav>

            <div className="exact-admin-sidebar-bottom">

                <div className="exact-admin-sidebar-user">
                    <div className="exact-admin-sidebar-avatar">
                        {currentUser?.email
                            ?.charAt(0)
                            ?.toUpperCase() || "A"}
                    </div>

                    <div>
                        <strong>Admin</strong>
                        <span>
                            {currentUser?.email ||
                                "admin@gmail.com"}
                        </span>
                    </div>

                    <span>⌄</span>
                </div>

                <button
                    className="exact-admin-logout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default AdminNavbar;
