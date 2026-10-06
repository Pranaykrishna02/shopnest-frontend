import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function ProductForm({
    initialData = null,
    onSubmit,
    onCancel
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "active",
        categoryId: "",
        image: ""
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price ?? "",
                stock: initialData.stock ?? "",
                status: initialData.status || "active",
                categoryId: initialData.categoryId || "",
                image: initialData.image || ""
            });
        }
    }, [initialData]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/category/list`
                );

                const result = await response.json();

                if (!response.ok || !result.status) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch categories"
                    );
                }

                setCategories(result.data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            formData.price === "" ||
            formData.stock === "" ||
            !formData.categoryId ||
            !formData.image.trim()
        ) {
            setError("Please fill all required fields");
            return;
        }

        if (Number(formData.price) < 0) {
            setError("Price cannot be negative");
            return;
        }

        if (Number(formData.stock) < 0) {
            setError("Stock cannot be negative");
            return;
        }

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            stock: Number(formData.stock),
            status: formData.status,
            categoryId: formData.categoryId,
            image: formData.image.trim()
        };

        setError("");

        onSubmit(productData);
    };

    return (
        <div className="product-form-container">

            <div className="product-form-header">

                <h2>
                    {initialData
                        ? "Edit Product"
                        : "Add New Product"}
                </h2>

                <p>
                    {initialData
                        ? "Update product information"
                        : "Enter product information"}
                </p>

            </div>

            {error && (
                <div className="product-form-error">
                    {error}
                </div>
            )}

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">

                    <label>
                        Product Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
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
                        placeholder="Enter product description"
                        rows="4"
                    />

                </div>

                <div className="form-group">

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        min="0"
                    />

                </div>

                <div className="form-group">

                    <label>
                        Category
                    </label>

                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        disabled={loadingCategories}
                    >

                        <option value="">
                            {loadingCategories
                                ? "Loading categories..."
                                : "Select category"}
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.name}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="form-group">

                    <label>
                        Stock
                    </label>

                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter stock quantity"
                        min="0"
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

                <div className="form-group">

                    <label>
                        Image URL
                    </label>

                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                    />

                </div>

                {formData.image && (
                    <div className="product-image-preview">

                        <p>
                            Image Preview
                        </p>

                        <img
                            src={formData.image}
                            alt="Product preview"
                        />

                    </div>
                )}

                <div className="product-form-actions">

                    <button
                        type="submit"
                        className="save-product-button"
                    >
                        {initialData
                            ? "Update Product"
                            : "Save Product"}
                    </button>

                    <button
                        type="button"
                        className="cancel-product-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ProductForm;