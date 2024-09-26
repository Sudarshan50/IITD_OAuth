import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider>
            <ToastContainer />
            <App />
        </ThemeProvider>
    </StrictMode>
);
