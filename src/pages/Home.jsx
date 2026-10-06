import { useEffect, useState } from "react";

import {Link,useNavigate} from "react-router-dom";

import ProductCard from "../components/ProductCard";

const API_URL = process.env.REACT_APP_API_URL;


function Home() {

    const navigate = useNavigate();


    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);


    const [loading, setLoading] = useState(true);

    const [categoryLoading, setCategoryLoading] = useState(true);


    const [error, setError] = useState("");

    const [categoryError, setCategoryError] = useState("");


    const [search, setSearch] = useState("");


    /*
    ======================================================
    FETCH PRODUCTS
    ======================================================
    */

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    `${API_URL}/product/list`
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


    /*
    ======================================================
    FETCH CATEGORIES
    ======================================================
    */

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setCategoryLoading(true);

                setCategoryError("");


                const response = await fetch(
                    `${API_URL}/category/list`
                );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.status
                ) {

                    throw new Error(
                        result.message ||
                        "Failed to fetch categories"
                    );

                }


                setCategories(
                    result.data || []
                );


            } catch (error) {

                setCategoryError(
                    error.message
                );


            } finally {

                setCategoryLoading(false);

            }

        };


        fetchCategories();

    }, []);


    /*
    ======================================================
    PRODUCT SECTIONS
    ======================================================
    */

    const topDeals =
        products.slice(0, 8);


    const trendingProducts =
        products.slice(8, 16);


    /*
    ======================================================
    SEARCH
    ======================================================
    */

    const handleSearch = (event) => {

        event.preventDefault();


        const searchValue =
            search.trim();


        if (!searchValue) {

            navigate("/products");

            return;

        }


        navigate(
            `/products?search=${encodeURIComponent(
                searchValue
            )}`
        );

    };


    /*
    ======================================================
    CATEGORY ICONS
    ======================================================
    */

    const categoryIcons = [

        "📱",
        "💻",
        "🎧",
        "📺",
        "👕",
        "👟",
        "💄",
        "🏠",
        "🍳",
        "🧸",
        "📚",
        "🏏",
        "👜",
        "💎",
        "👶",
        "🛒",
        "🚗",
        "⌨️",
        "🎮"

    ];


    /*
    ======================================================
    PAGE
    ======================================================
    */

    return (

        <div className="store-home">


            {/* =================================================
                SEARCH + SHORTCUT HEADER

                Duplicate "My Store" header removed.
            ================================================= */}

            <section className="store-home-header">


                {/* SEARCH */}

                <form
                    className="store-home-search"
                    onSubmit={handleSearch}
                >

                    <span>
                        🔍
                    </span>


                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search products..."
                    />


                    {search && (

                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>

                    )}


                    <button
                        type="submit"
                        className="store-search-button"
                    >
                        Search
                    </button>

                </form>


                {/* SHORTCUTS */}

                <div className="store-home-shortcuts">


                    <Link to="/products">

                        <span>
                            ⚡
                        </span>

                        <strong>
                            Deals
                        </strong>

                    </Link>


                    <Link to="/products">

                        <span>
                            🛒
                        </span>

                        <strong>
                            Fresh
                        </strong>

                    </Link>


                    <Link to="/products">

                        <span>
                            🔥
                        </span>

                        <strong>
                            Top Picks
                        </strong>

                    </Link>


                    <Link to="/products">

                        <span>
                            🎁
                        </span>

                        <strong>
                            Offers
                        </strong>

                    </Link>


                    <Link to="/products">

                        <span>
                            ⭐
                        </span>

                        <strong>
                            Popular
                        </strong>

                    </Link>


                </div>


            </section>


            {/* =================================================
                CATEGORIES
            ================================================= */}

            <section className="store-home-category-section">


                <div className="store-home-section-title">

                    <div>

                        <span>
                            EXPLORE
                        </span>

                        <h2>
                            Shop By Category
                        </h2>

                    </div>


                    <Link to="/products">
                        View All
                    </Link>

                </div>


                {categoryLoading && (

                    <div className="store-home-message">

                        Loading categories...

                    </div>

                )}


                {categoryError && (

                    <div className="store-home-error">

                        {categoryError}

                    </div>

                )}


                {!categoryLoading &&
                    !categoryError &&
                    categories.length > 0 && (

                        <div className="store-category-slider">

                            <div className="store-category-track">

                                {[
                                    ...categories,
                                    ...categories
                                ].map(
                                    (
                                        category,
                                        index
                                    ) => (

                                        <Link
                                            key={`${category._id}-${index}`}
                                            to={`/products?category=${encodeURIComponent(
                                                category.name
                                            )}`}
                                            className="store-category-item"
                                        >

                                            <div className="store-category-icon">

                                                {
                                                    categoryIcons[
                                                        index %
                                                        categoryIcons.length
                                                    ]
                                                }

                                            </div>


                                            <span>
                                                {category.name}
                                            </span>

                                        </Link>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                {!categoryLoading &&
                    !categoryError &&
                    categories.length === 0 && (

                        <div className="store-home-message">

                            No categories available.

                        </div>

                    )}

            </section>


            {/* =================================================
                BANNER
            ================================================= */}

            <section className="store-home-banner-section">

                <div className="store-home-banner-track">


                    <div className="store-home-banner banner-one">

                        <div className="store-banner-content">

                            <span>
                                MEGA SHOPPING FEST
                            </span>

                            <h1>
                                Big Deals
                                <br />
                                Big Savings
                            </h1>

                            <p>
                                Discover amazing products
                                at unbeatable prices.
                            </p>

                            <Link to="/products">
                                Shop Now →
                            </Link>

                        </div>


                        <div className="store-banner-visual">
                            🛍️
                        </div>

                    </div>


                    <div className="store-home-banner banner-two">

                        <div className="store-banner-content">

                            <span>
                                ELECTRONICS SALE
                            </span>

                            <h1>
                                Upgrade
                                <br />
                                Your Tech
                            </h1>

                            <p>
                                Smartphones, laptops,
                                accessories and more.
                            </p>

                            <Link to="/products">
                                Explore Deals →
                            </Link>

                        </div>


                        <div className="store-banner-visual">
                            💻
                        </div>

                    </div>


                </div>

            </section>


            {/* =================================================
                TOP DEALS
            ================================================= */}

            <section className="store-home-section">


                <div className="store-home-section-title">

                    <div>

                        <span>
                            🔥 LIMITED TIME
                        </span>

                        <h2>
                            Top Deals
                        </h2>

                    </div>


                    <Link to="/products">
                        View All
                    </Link>

                </div>


                {loading && (

                    <div className="store-home-message">

                        Loading products...

                    </div>

                )}


                {error && (

                    <div className="store-home-error">

                        {error}

                    </div>

                )}


                {!loading &&
                    !error &&
                    topDeals.length > 0 && (

                        <div className="store-deals-slider">

                            <div className="store-deals-track">

                                {[
                                    ...topDeals,
                                    ...topDeals
                                ].map(
                                    (
                                        product,
                                        index
                                    ) => (

                                        <div
                                            key={`${product._id}-${index}`}
                                            className="store-deal-card"
                                        >

                                            <ProductCard
                                                product={
                                                    product
                                                }
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

            </section>


            {/* =================================================
                SPECIAL OFFER
            ================================================= */}

            <section className="store-offer-banner">


                <div>

                    <span>
                        SPECIAL OFFER
                    </span>

                    <h2>
                        Upgrade Your Everyday Shopping
                    </h2>

                    <p>
                        Quality products.
                        Amazing prices.
                        One destination.
                    </p>

                    <Link to="/products">
                        Shop Now →
                    </Link>

                </div>


                <div className="store-offer-icon">
                    ⚡
                </div>


            </section>


            {/* =================================================
                TRENDING PRODUCTS
            ================================================= */}

            {!loading &&
                !error &&
                trendingProducts.length > 0 && (

                    <section className="store-home-section">


                        <div className="store-home-section-title">

                            <div>

                                <span>
                                    TRENDING NOW
                                </span>

                                <h2>
                                    Popular Products
                                </h2>

                            </div>


                            <Link to="/products">
                                View All
                            </Link>

                        </div>


                        <div className="store-product-grid">

                            {trendingProducts.map(
                                (product) => (

                                    <ProductCard
                                        key={
                                            product._id
                                        }
                                        product={
                                            product
                                        }
                                    />

                                )
                            )}

                        </div>


                    </section>

                )}


            {/* =================================================
                BENEFITS
            ================================================= */}

            <section className="store-benefits">


                <div>

                    <span>
                        🚚
                    </span>

                    <strong>
                        Fast Delivery
                    </strong>

                    <small>
                        Quick doorstep delivery
                    </small>

                </div>


                <div>

                    <span>
                        🔒
                    </span>

                    <strong>
                        Secure Payment
                    </strong>

                    <small>
                        Safe and secure checkout
                    </small>

                </div>


                <div>

                    <span>
                        ↩️
                    </span>

                    <strong>
                        Easy Returns
                    </strong>

                    <small>
                        Simple return process
                    </small>

                </div>


                <div>

                    <span>
                        🎧
                    </span>

                    <strong>
                        24/7 Support
                    </strong>

                    <small>
                        We're here to help
                    </small>

                </div>


            </section>


            {/* =================================================
                MOBILE BOTTOM NAVIGATION
            ================================================= */}

            <nav className="store-mobile-bottom-nav">


                <Link
                    to="/"
                    className="active"
                >

                    <span>
                        ⌂
                    </span>

                    <small>
                        Home
                    </small>

                </Link>


                <Link to="/products">

                    <span>
                        🔎
                    </span>

                    <small>
                        Shop
                    </small>

                </Link>


                <Link to="/cart">

                    <span>
                        🛒
                    </span>

                    <small>
                        Cart
                    </small>

                </Link>


                <Link to="/orders">

                    <span>
                        📦
                    </span>

                    <small>
                        Orders
                    </small>

                </Link>


                <Link to="/login">

                    <span>
                        👤
                    </span>

                    <small>
                        Account
                    </small>

                </Link>


            </nav>


        </div>

    );

}


export default Home;