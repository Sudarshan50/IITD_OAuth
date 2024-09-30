import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./api";
import Cookies from "js-cookie";
import { Spinner } from "@material-tailwind/react";

// Mock functions to simulate authentication and admin check
const isAuthenticated = async () => {
    const token = Cookies.get("adminToken");
    if (!token) return { isAuthenticated: false };

    try {
        const res = await api.get("/admin/verify");
        if (res.status === 200) {
            return {
                isAuthenticated: true,
                isAdmin: res.data.data === "admin",
                isSuperAdmin: res.data.data === "superadmin",
            };
        }
    } catch (err) {
        console.error(err);
        return { isAuthenticated: false };
    }
};

const ProtectedRoute = ({ adminOnly = false, superAdminOnly = false }) => {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
            const authStatus = await isAuthenticated();
            if (authStatus.isAuthenticated) {
                if (superAdminOnly) {
                setAuthorized(authStatus.isSuperAdmin);
                } else if (adminOnly) {
                setAuthorized(authStatus.isAdmin || authStatus.isSuperAdmin);
                } else {
                setAuthorized(true);
                }
            } else {
                setAuthorized(false);
            }
            } catch (error) {
            setAuthorized(false);
            console.error(error);
            } finally {
            setLoading(false);
            }
        };

        checkAuth();
    }, [adminOnly, superAdminOnly]);

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner
                    color="blue"
                    size="xl"
                />
            </div>
        );

    return authorized ? <Outlet /> : <Navigate to={"/unauthorised"} />;
};

export default ProtectedRoute;

