import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const API_URL = process.env.REACT_APP_API_URL;

function Products() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const categoryFromUrl =
        searchParams.get("category") || "all";

    const searchFromUrl =
        searchParams.get("search") || "";

    const [products, setProducts] = useState([]);

    const [search, setSearch] =
        useState(searchFromUrl);

    const [category, setCategory] =
        useState(categoryFromUrl);

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [sort, setSort] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const productsPerPage = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/product`
                );

                const result =
                    await response.json();

                if (
                    !response.ok ||
                    !result.status
                ) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch products"
                    );
                }

                setProducts(
                    result.data || []
                );

            } catch (error) {
                setError(
                    error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCategory(categoryFromUrl);
        setSearch(searchFromUrl);
        setCurrentPage(1);
    }, [
        categoryFromUrl,
        searchFromUrl
    ]);

    const categories = [
        ...new Set(
            products
                .map(
                    (product) =>
                        product.categoryId?.name
                )
                .filter(Boolean)
        )
    ];

    const invalidPriceRange =
        minPrice !== "" &&
        maxPrice !== "" &&
        Number(minPrice) >
            Number(maxPrice);

    const filteredProducts =
        products.filter(
            (product) => {

                const matchesSearch =
                    product.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesCategory =
                    category === "all" ||
                    product.categoryId?.name ===
                        category;

                const matchesMinPrice =
                    minPrice === "" ||
                    Number(product.price) >=
                        Number(minPrice);

                const matchesMaxPrice =
                    maxPrice === "" ||
                    Number(product.price) <=
                        Number(maxPrice);

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesMinPrice &&
                    matchesMaxPrice
                );
            }
        );

    const sortedProducts =
        [...filteredProducts].sort(
            (a, b) => {

                if (
                    sort === "low-high"
                ) {
                    return (
                        Number(a.price) -
                        Number(b.price)
                    );
                }

                if (
                    sort === "high-low"
                ) {
                    return (
                        Number(b.price) -
                        Number(a.price)
                    );
                }

                return 0;
            }
        );

    const totalPages =
        Math.ceil(
            sortedProducts.length /
                productsPerPage
        );

    const startIndex =
        (currentPage - 1) *
        productsPerPage;

    const endIndex =
        startIndex +
        productsPerPage;

    const paginatedProducts =
        sortedProducts.slice(
            startIndex,
            endIndex
        );

    const handleSearchChange =
        (event) => {

            const value =
                event.target.value;

            setSearch(value);
            setCurrentPage(1);

            const params =
                new URLSearchParams(
                    searchParams
                );

            if (value.trim()) {
                params.set(
                    "search",
                    value
                );
            } else {
                params.delete(
                    "search"
                );
            }

            if (category !== "all") {
                params.set(
                    "category",
                    category
                );
            } else {
                params.delete(
                    "category"
                );
            }

            setSearchParams(params);
        };

    const handleCategoryChange =
        (event) => {

            const value =
                event.target.value;

            setCategory(value);
            setCurrentPage(1);

            const params =
                new URLSearchParams(
                    searchParams
                );

            if (value !== "all") {
                params.set(
                    "category",
                    value
                );
            } else {
                params.delete(
                    "category"
                );
            }

            if (search.trim()) {
                params.set(
                    "search",
                    search
                );
            } else {
                params.delete(
                    "search"
                );
            }

            setSearchParams(params);
        };

    const handleMinPriceChange =
        (event) => {

            setMinPrice(
                event.target.value
            );

            setCurrentPage(1);
        };

    const handleMaxPriceChange =
        (event) => {

            setMaxPrice(
                event.target.value
            );

            setCurrentPage(1);
        };

    const handleSortChange =
        (event) => {

            setSort(
                event.target.value
            );

            setCurrentPage(1);
        };

    const clearFilters = () => {

        setSearch("");
        setCategory("all");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setCurrentPage(1);

        setSearchParams({});
    };

    const hasFilters =
        search ||
        category !== "all" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        sort !== "";

    if (loading) {
        return (
            <div className="products-container">

                <h1>
                    Our Products
                </h1>

                <div className="products-loading">

                    <p>
                        Loading products...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="products-container">

                <h1>
                    Our Products
                </h1>

                <div className="products-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="products-container">

            <div className="products-header">

                <div>

                    <h1>
                        Our Products
                    </h1>

                    <p>
                        Browse and find the products
                        you need.
                    </p>

                </div>

                <div className="products-total-count">

                    {products.length}
                    {" "}products available

                </div>

            </div>

            <div className="product-filters">

                <div className="product-search">

                    <input
                        type="text"
                        value={search}
                        onChange={
                            handleSearchChange
                        }
                        placeholder="Search products..."
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");

                                const params =
                                    new URLSearchParams(
                                        searchParams
                                    );

                                params.delete(
                                    "search"
                                );

                                setSearchParams(
                                    params
                                );

                                setCurrentPage(1);
                            }}
                        >
                            Clear
                        </button>
                    )}

                </div>

                <div className="product-category-filter">

                    <select
                        value={category}
                        onChange={
                            handleCategoryChange
                        }
                    >

                        <option value="all">
                            All Categories
                        </option>

                        {categories.map(
                            (categoryName) => (
                                <option
                                    key={categoryName}
                                    value={categoryName}
                                >
                                    {categoryName}
                                </option>
                            )
                        )}

                    </select>

                </div>

                <div className="product-price-filter">

                    <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={
                            handleMinPriceChange
                        }
                        placeholder="Min Price"
                    />

                    <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={
                            handleMaxPriceChange
                        }
                        placeholder="Max Price"
                    />

                </div>

                <div className="product-sort-filter">

                    <select
                        value={sort}
                        onChange={
                            handleSortChange
                        }
                    >

                        <option value="">
                            Sort By
                        </option>

                        <option value="low-high">
                            Price: Low to High
                        </option>

                        <option value="high-low">
                            Price: High to Low
                        </option>

                    </select>

                </div>

                {hasFilters && (
                    <button
                        type="button"
                        className="clear-filters-button"
                        onClick={
                            clearFilters
                        }
                    >
                        Clear Filters
                    </button>
                )}

            </div>

            {invalidPriceRange && (
                <div className="filter-warning">

                    Minimum price cannot be
                    greater than maximum price.

                </div>
            )}

            {hasFilters &&
                !invalidPriceRange && (
                    <div className="active-filters">

                        <span>
                            {sortedProducts.length}
                            {" "}matching products
                        </span>

                        {search && (
                            <span>
                                Search: "{search}"
                            </span>
                        )}

                        {category !== "all" && (
                            <span>
                                Category: {category}
                            </span>
                        )}

                        {minPrice !== "" && (
                            <span>
                                Min: ₹{minPrice}
                            </span>
                        )}

                        {maxPrice !== "" && (
                            <span>
                                Max: ₹{maxPrice}
                            </span>
                        )}

                        {sort === "low-high" && (
                            <span>
                                Sort: Low to High
                            </span>
                        )}

                        {sort === "high-low" && (
                            <span>
                                Sort: High to Low
                            </span>
                        )}

                    </div>
                )}

            {invalidPriceRange ? (

                <div className="products-empty">

                    <p>
                        Please enter a valid
                        price range.
                    </p>

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                    >
                        Clear Filters
                    </button>

                </div>

            ) : sortedProducts.length === 0 ? (

                <div className="products-empty">

                    <p>
                        No products found
                        matching your filters.
                    </p>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                        >
                            Clear Filters
                        </button>
                    )}

                </div>

            ) : (

                <>

                    <p className="product-result-count">

                        Showing{" "}
                        {startIndex + 1}
                        {" - "}
                        {Math.min(
                            endIndex,
                            sortedProducts.length
                        )}
                        {" of "}
                        {sortedProducts.length}
                        {" "}matching products

                    </p>

                    <div className="products-grid">

                        {paginatedProducts.map(
                            (product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            )
                        )}

                    </div>

                    <Pagination
                        currentPage={
                            currentPage
                        }
                        totalPages={
                            totalPages
                        }
                        onPageChange={
                            setCurrentPage
                        }
                    />

                </>

            )}

        </div>
    );
}

export default Products;