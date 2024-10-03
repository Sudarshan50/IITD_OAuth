import { Button } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Navbar = () => {
    const navigate = useNavigate();
    const { pathname } = window.location;
    const [role, setRole] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen); // Toggle the drawer state
    };

    useEffect(() => {
        try {
            const token = Cookies.get("adminToken");
            const payload = JSON.parse(atob(token.split(".")[1]));
            setRole(payload.permission_code);
        } catch (err) {
            console.log(err);
        }
    }, [role]);
    const closeDrawer = () => {
        setIsOpen(false); // Close the drawer
    };

    return (
        <nav className="relative bg-blue-gray-900 px-4 py-2 text-white md:p-4">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-lg font-bold md:text-2xl">Admin Dashboard</h1>

                {/* Menu Icon for screens below md */}
                <div className="md:hidden">
                    <Bars3Icon
                        className="h-8 w-8 cursor-pointer text-white"
                        onClick={toggleDrawer}
                    />
                </div>

                {/* Buttons for md and above */}

                <div className="hidden space-x-4 md:flex">
                    {pathname !== "/superadmin/logs" && role === "superadmin" && (
                        <Button
                            className="rounded-lg bg-green-400 px-4 py-2 font-semibold text-gray-900 hover:bg-green-500"
                            onClick={() => navigate("/superadmin/logs")}
                        >
                            Admin Logs
                        </Button>
                    )}
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
                                        autoClose: 2000,
                                    }
                                )
                                .then((res) => {
                                    if (res.status === 200) {
                                        cookie.set("adminToken", "", { expires: 0 });
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
            {/* Drawer for mobile */}
            {isOpen && (
                <div className="md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10 bg-black bg-opacity-50"
                        onClick={closeDrawer}
                    ></div>

                    {/* Side Drawer */}
                    <div className="fixed right-0 top-0 z-20 flex h-full w-64 items-center justify-center bg-blue-gray-400 p-6 text-gray-900 sm:w-96">
                        <div className="flex flex-col space-y-4">
                            {pathname !== "/superadmin/logs" && role === "superadmin" && (
                                <Button
                                    className="rounded-lg bg-blue-400 px-4 py-2 font-semibold text-gray-900 hover:bg-blue-500"
                                    onClick={() => navigate("/superadmin/logs")}
                                >
                                    Admin Logs
                                </Button>
                            )}
                            {pathname !== "/admin/dashboard" && (
                                <Button
                                    className="rounded-lg bg-green-400 px-4 py-2 font-semibold text-gray-900 hover:bg-green-500"
                                    onClick={() => {
                                        navigate("/admin/dashboard");
                                        closeDrawer();
                                    }}
                                >
                                    Home
                                </Button>
                            )}
                            {pathname !== "/admin/reg" && (
                                <Button
                                    className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
                                    onClick={() => {
                                        navigate("/admin/reg");
                                        closeDrawer();
                                    }}
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
                                                autoClose: 2000,
                                            }
                                        )
                                        .then((res) => {
                                            if (res.status === 200) {
                                                cookie.remove("admin_token");
                                                navigate("/admin/signin");
                                                closeDrawer();
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
                </div>
            )}
        </nav>
    );
};

export default Navbar;
