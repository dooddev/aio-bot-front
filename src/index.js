import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {Provider} from "react-redux";
import store from "./scripts/store/store";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId="602856781389-qe3po934e411bpenulk82base5eoa0l5.apps.googleusercontent.com">
        <BrowserRouter>
            <App />
        </BrowserRouter>
        </GoogleOAuthProvider>
    </Provider>

);
