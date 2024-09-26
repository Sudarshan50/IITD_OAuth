import { useLocation } from "react-router-dom";
import logo from "../pages/devclub_logo.png";

const LoginPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const client_name = query.get("client_name");
    const handleMicrosoftLogin = () => {
        window.location.href = "/api/oauth/auth/microsoft";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Yahan se Kuch Ni Hota..");
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {/* Login Section */}
            <div className="flex flex-grow items-center justify-center">
                <div className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
                    {/* Left side: Login Form */}
                    <div className="w-1/2 p-8">
                        <h2 className="mb-6 text-3xl font-bold text-gray-700">Login to {client_name}</h2>

                        {/* Login Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-indigo-500 px-4 py-3 font-semibold text-white hover:bg-indigo-600"
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        {/* Microsoft Login Button */}
                        <div className="mt-6">
                            <button
                                onClick={handleMicrosoftLogin}
                                className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                                    alt="Microsoft Logo"
                                    className="mr-2 h-5 w-5"
                                />
                                Login with Microsoft
                            </button>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center">
                        <img
                            src={logo}
                            alt="DevClub Logo"
                            className="h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
