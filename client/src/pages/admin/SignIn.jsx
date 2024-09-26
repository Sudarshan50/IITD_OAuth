import { useState } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminSignIn = () => {
    const navigate = useNavigate();
    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        toast.promise(
            axios.post("http://localhost:3000/api/admin/signin", {
                userName,
                password,
            }),
            {
                pending: "Signing in...",
                success: {
                    render({ data }) {
                        cookie.set("adminToken", data.data.token);
                        navigate("/admin/dashboard");
                        return "Signed in successfully!";
                    },
                },
                error: {
                    render({ data }) {
                        return `Sign in failed: ${data.message}`;
                    },
                },
            }
        );
    };

    return (
        <div className="flex min-h-[calc(94.84vh-1px)] items-center justify-center overflow-hidden bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Admin Sign In</h2>
                <form
                    onSubmit={handleSignIn}
                    className="space-y-6"
                >
                    {/* userName Input */}
                    <div>
                        <label
                            className="mb-2 block font-semibold text-gray-700"
                            htmlFor="userName"
                        >
                            User Name
                        </label>
                        <input
                            id="userName"
                            type="userName"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                            placeholder="Enter your userName"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            className="mb-2 block font-semibold text-gray-700"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Sign In Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminSignIn;
