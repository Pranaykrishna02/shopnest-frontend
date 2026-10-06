import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/Context";

function AdminRoute({ children }) {
    const { isLoggedIn, currentUser } = useAppContext();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser?.role !== "admin") {
        return <Navigate to="/products" replace />;
    }

    return children;
}

export default AdminRoute;