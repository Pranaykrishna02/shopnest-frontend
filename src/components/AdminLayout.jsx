import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
    return (
        <div className="exact-admin-layout">
            <AdminNavbar />

            <main className="admin-main-content">
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;
