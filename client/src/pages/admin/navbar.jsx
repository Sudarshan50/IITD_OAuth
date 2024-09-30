import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
    const navigate = useNavigate();
    const { pathname } = window.location;

    return (
        <nav className="bg-blue-gray-900 p-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="space-x-4">
                    {pathname !== "/admin/dashboard" && (
                        <Button
                            className="rounded-lg bg-green-400 px-4 py-2 font-semibold text-gray-900 hover:bg-green-500"
                            onClick={() => navigate("/admin/dashboard")}
                        >
                            Home
                        </Button>
                    )}
                    {pathname !== "/admin/reg" && (
                        <Button
                            className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
                            onClick={() => navigate("/admin/reg")}
                        >
                            Register New Client
                        </Button>
                    )}
                    <Button
                        className="rounded-lg bg-red-400 px-4 py-2 font-semibold text-gray-900 hover:bg-red-500"
                        onClick={() => {
                            toast
                                .promise(
                                    axios.get("/admin/logout"),
                                    {
                                        pending: "Logging out...",
                                        success: "Logged out successfully!",
                                        error: "Logout failed!",
                                    },
                                    {
                                        autoClose: 1000,
                                    }
                                )
                                .then((res) => {
                                    if (res.status === 200) {
                                        cookie.remove("admin_token");
                                        navigate("/admin/signin");
                                    }
                                })
                                .catch((err) => {
                                    throw new Error(err);
                                });
                        }}
                    >
                        Log Out
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
