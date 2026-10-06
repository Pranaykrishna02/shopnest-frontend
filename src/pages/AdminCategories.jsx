import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "active"
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/category/list`
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message || "Failed to fetch categories"
                );
            }

            setCategories(result.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    };

    const handleCreateCategory = async (event) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");

        if (
            !formData.name.trim() ||
            !formData.description.trim()
        ) {
            setError("Please fill all required fields");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/category`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        description: formData.description.trim(),
                        status: formData.status
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to create category"
                );
            }

            setSuccessMessage(
                "Category created successfully"
            );

            setFormData({
                name: "",
                description: "",
                status: "active"
            });

            setShowForm(false);

            await fetchCategories();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
            status: category.status || "active"
        });

        setShowForm(true);
        setError("");
        setSuccessMessage("");
    };

    const handleUpdateCategory = async (event) => {
        event.preventDefault();

        setError("");
        setSuccessMessage("");

        if (
            !formData.name.trim() ||
            !formData.description.trim()
        ) {
            setError("Please fill all required fields");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/category/${editingCategory._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        description: formData.description.trim(),
                        status: formData.status
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to update category"
                );
            }

            setSuccessMessage(
                "Category updated successfully"
            );

            setFormData({
                name: "",
                description: "",
                status: "active"
            });

            setEditingCategory(null);
            setShowForm(false);

            await fetchCategories();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `${API_URL}/category/${categoryId}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {
                throw new Error(
                    result.message ||
                    "Failed to delete category"
                );
            }

            setSuccessMessage(
                "Category deleted successfully"
            );

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (category) =>
                        category._id !== categoryId
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCategory(null);

        setFormData({
            name: "",
            description: "",
            status: "active"
        });

        setError("");
        setSuccessMessage("");
    };

    if (loading) {
        return (
            <div className="admin-products-page">
                <h1>Admin Categories</h1>
                <p>Loading categories...</p>
            </div>
        );
    }

    if (error && categories.length === 0) {
        return (
            <div className="admin-products-page">
                <h1>Admin Categories</h1>

                <p>{error}</p>

                <button onClick={fetchCategories}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-products-page">

            <div className="admin-products-header">

                <div>
                    <h1>Admin Categories</h1>
                    <p>Manage your product categories</p>
                </div>

                {!showForm && (
                    <button
                        className="add-product-button"
                        onClick={() => {
                            setEditingCategory(null);

                            setFormData({
                                name: "",
                                description: "",
                                status: "active"
                            });

                            setShowForm(true);
                            setError("");
                            setSuccessMessage("");
                        }}
                    >
                        + Add Category
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
                <div className="product-form-container">

                    <div className="product-form-header">

                        <h2>
                            {editingCategory
                                ? "Edit Category"
                                : "Add New Category"}
                        </h2>

                        <p>
                            {editingCategory
                                ? "Update category information"
                                : "Enter category information"}
                        </p>

                    </div>

                    <form
                        className="product-form"
                        onSubmit={
                            editingCategory
                                ? handleUpdateCategory
                                : handleCreateCategory
                        }
                    >

                        <div className="form-group">

                            <label>
                                Category Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter category name"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter category description"
                                rows="4"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>

                        <div className="product-form-actions">

                            <button
                                type="submit"
                                className="save-product-button"
                            >
                                {editingCategory
                                    ? "Update Category"
                                    : "Save Category"}
                            </button>

                            <button
                                type="button"
                                className="cancel-product-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            ) : (
                <>
                    {categories.length === 0 ? (
                        <div className="empty-products">

                            <h2>
                                No Categories Found
                            </h2>

                            <p>
                                There are no categories available.
                            </p>

                        </div>
                    ) : (
                        <div className="products-table-container">

                            <table className="products-table">

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {categories.map((category) => (
                                        <tr key={category._id}>

                                            <td>
                                                {category.name}
                                            </td>

                                            <td>
                                                {category.description}
                                            </td>

                                            <td>
                                                {category.status}
                                            </td>

                                            <td>

                                                <button
                                                    className="edit-product-button"
                                                    onClick={() =>
                                                        handleEditCategory(
                                                            category
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-product-button"
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category._id
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

export default AdminCategories;