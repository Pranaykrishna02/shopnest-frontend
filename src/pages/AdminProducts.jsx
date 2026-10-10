
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductForm from "../components/ProductForm";

const API_URL = process.env.REACT_APP_API_URL;

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/product/list`);
            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to fetch products"
                );
            }

            setProducts(result.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Search by product name, category, or status
    const filteredProducts = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) return products;

        return products.filter((product) => {
            const name = product.name?.toLowerCase() || "";
            const category =
                product.categoryId?.name?.toLowerCase() || "";
            const status = product.status?.toLowerCase() || "";

            return (
                name.includes(search) ||
                category.includes(search) ||
                status.includes(search)
            );
        });
    }, [products, searchTerm]);

    // Create product
    const handleCreateProduct = async (productData) => {
        try {
            setError("");
            setSuccessMessage("");

            const response = await fetch(`${API_URL}/product/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to create product"
                );
            }

            setSuccessMessage("Product created successfully");
            setShowForm(false);
            setSearchTerm("");

            await fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    // Update product
    const handleUpdateProduct = async (productData) => {
        try {
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `${API_URL}/product/${editingProduct._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(productData)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to update product"
                );
            }

            setSuccessMessage("Product updated successfully");
            setShowForm(false);
            setEditingProduct(null);

            await fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    // Open edit form
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
        setError("");
        setSuccessMessage("");
    };

    // Delete product
    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `${API_URL}/product/${productId}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to delete product"
                );
            }

            setSuccessMessage("Product deleted successfully");

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product._id !== productId
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    // Cancel form
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setError("");
        setSuccessMessage("");
    };

    if (loading) {
        return (
            <div className="admin-products-page">
                <h1>Admin Products</h1>
                <p>Loading products...</p>
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="admin-products-page">
                <h1>Admin Products</h1>

                <p className="product-form-error">{error}</p>

                <button
                    type="button"
                    className="add-product-button"
                    onClick={fetchProducts}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-products-page">
            {/* Page header */}
            <div className="admin-products-header">
                <div>
                    <h1>Admin Products</h1>
                    <p>Manage your products</p>
                </div>

                {!showForm && (
                    <button
                        type="button"
                        className="add-product-button"
                        onClick={() => {
                            setEditingProduct(null);
                            setShowForm(true);
                            setError("");
                            setSuccessMessage("");
                        }}
                    >
                        + Add Product
                    </button>
                )}
            </div>

            {/* Success message */}
            {successMessage && (
                <div className="product-success-message">
                    {successMessage}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="product-form-error">
                    {error}
                </div>
            )}

            {/* Add/Edit form */}
            {showForm ? (
                <ProductForm
                    initialData={editingProduct}
                    onSubmit={
                        editingProduct
                            ? handleUpdateProduct
                            : handleCreateProduct
                    }
                    onCancel={handleCancelForm}
                />
            ) : (
                <>
                    {/* Search toolbar */}
                    <div className="admin-products-toolbar">
                        <div className="admin-products-search">
                            <svg
                                className="admin-search-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m16 16 4 4" />
                            </svg>

                            <input
                                type="search"
                                placeholder="Search products by name, category, or status..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                aria-label="Search products by name, category, or status"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    className="admin-search-clear"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        <span className="admin-products-count">
                            {filteredProducts.length} of {products.length} products
                        </span>
                    </div>

                    {/* Products table */}
                    {filteredProducts.length === 0 ? (
                        <div className="empty-products">
                            <h2>
                                {searchTerm
                                    ? "No Matching Products"
                                    : "No Products Found"}
                            </h2>

                            <p>
                                {searchTerm
                                    ? "Try another product name, category, or status."
                                    : "There are no products available."}
                            </p>

                            {searchTerm && (
                                <button
                                    type="button"
                                    className="add-product-button"
                                    onClick={() => setSearchTerm("")}
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="products-table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <img
                                                    src={
                                                        product.image ||
                                                        "https://via.placeholder.com/70?text=No+Image"
                                                    }
                                                    alt={product.name}
                                                    className="admin-product-image"
                                                />
                                            </td>

                                            <td>{product.name}</td>

                                            <td>
                                                ₹
                                                {Number(
                                                    product.price
                                                ).toLocaleString("en-IN")}
                                            </td>

                                            <td>
                                                {product.categoryId?.name ||
                                                    "Not available"}
                                            </td>

                                            <td>{product.stock}</td>

                                            <td>
                                                <span
                                                    className={`admin-product-status ${
                                                        product.status === "active"
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-product-actions">
                                                    <button
                                                        type="button"
                                                        className="edit-product-button"
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-product-button"
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminProducts;
