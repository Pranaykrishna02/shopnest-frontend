import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

const API_URL = process.env.REACT_APP_API_URL;

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                 `${API_URL}/product/list`
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to fetch products"
                );
            }

            setProducts(result.data || []);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateProduct = async (productData) => {
        try {
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `${API_URL}/product/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(productData)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to create product"
                );
            }

            setSuccessMessage(
                "Product created successfully"
            );

            setShowForm(false);

            await fetchProducts();

        } catch (error) {
            setError(error.message);
        }
    };

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
                    result.message ||
                    "Failed to update product"
                );
            }

            setSuccessMessage(
                "Product updated successfully"
            );

            setShowForm(false);
            setEditingProduct(null);

            await fetchProducts();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
        setError("");
        setSuccessMessage("");
    };

    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

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
                    result.message ||
                    "Failed to delete product"
                );
            }

            setSuccessMessage(
                "Product deleted successfully"
            );

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) =>
                        product._id !== productId
                )
            );

        } catch (error) {
            setError(error.message);
        }
    };

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

                <p>{error}</p>

                <button onClick={fetchProducts}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-products-page">

            <div className="admin-products-header">

                <div>
                    <h1>Admin Products</h1>

                    <p>
                        Manage your products
                    </p>
                </div>

                {!showForm && (
                    <button
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

            {successMessage && (
                <div className="product-success-message">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="product-form-error">
                    {error}
                </div>
            )}

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
                    {products.length === 0 ? (
                        <div className="empty-products">

                            <h2>No Products Found</h2>

                            <p>
                                There are no products available.
                            </p>

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

                                    {products.map((product) => (
                                        <tr
                                            key={product._id}
                                        >

                                            <td>
                                                <img
                                                    src={
                                                        product.image ||
                                                        "https://via.placeholder.com/70?text=No+Image"
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    className="admin-product-image"
                                                />
                                            </td>

                                            <td>
                                                {product.name}
                                            </td>

                                            <td>
                                                ₹{product.price}
                                            </td>

                                            <td>
                                                {product.categoryId?.name ||
                                                    "Not available"}
                                            </td>

                                            <td>
                                                {product.stock}
                                            </td>

                                            <td>
                                                {product.status}
                                            </td>

                                            <td>

                                                <button
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
                                                    className="delete-product-button"
                                                    onClick={() =>
                                                        handleDeleteProduct(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

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