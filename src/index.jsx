import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AppProvider } from "./context/Context";
import { CartProvider } from "./context/CartContext";

import "./App.css";


const root = ReactDOM.createRoot(
    document.getElementById("root")
);


root.render(
    <AppProvider>

        <CartProvider>

            <App />

        </CartProvider>

    </AppProvider>
);