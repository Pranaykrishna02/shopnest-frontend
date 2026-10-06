import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/Context";

function ProtectedRoute({ children }) {
    const { isLoggedIn, currentUser } = useAppContext();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser?.role !== "customer") {
        return <Navigate to="/admin/products" replace />;
    }

    return children;
}

export default ProtectedRoute;