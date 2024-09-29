import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
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
                            cookie.remove("adminToken");
                            navigate("/admin/signin");
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

