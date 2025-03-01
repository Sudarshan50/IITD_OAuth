import { Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../components/api";
import { MSLoginButton } from "../components/MSLoginButton";
import logo from "../pages/devclub_logo.png";

const SignIn = () => {
    const [clientName, setClientName] = useState("");
    const [verifyError, setVerifyError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const client_id = query.get("client_id");
    const redirect_uri = query.get("redirect_uri");

    useEffect(() => {
        const fetchClientInfo = async () => {
            setLoading(true);
            await api
                .post(`/auth/verify`, { client_id, redirect_uri })
                .then((res) => {
                    if (res.status === 200) {
                        setClientName(res.data.message);
                    }
                })
                .catch((err) => {
                    setVerifyError(err.response?.data || "Error verifying client");
                })
                .finally(() => setLoading(false));
        }
        fetchClientInfo();
    }, [client_id, redirect_uri]);

    useEffect(() => {
        const docTitle = document.title;
        if (clientName) {
            document.title = `${clientName} | Oauth Login`;
            return () => {
                document.title = docTitle;
            }
        }
    }, [clientName])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // post it to the server

        setSubmitting(true);
        await api.post(`/auth/login`, { ...data, client_id, redirect_uri })
            .then((res) => {
                if (res.status == 200) {
                    window.location.href = `${redirect_uri}?code=${res.data.auth_code}&state=${res.data.state}`;
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response?.data || "Error Logging in (Code: CA500)");
            })
            .finally(() => setSubmitting(false));
    }

    if (loading) {
        return (
            <div className="flex min-h-screen pb-8 items-center justify-center bg-gray-500">
                <div className="flex items-center justify-center rounded-xl bg-white p-8 shadow-2xl">
                    <Spinner className="h-12 w-12" />
                </div>
            </div>
        );
    }

    if (verifyError) {
        return (
            <div className="flex min-h-screen pb-8 items-center justify-center bg-gray-500">
                <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                    <h2 className="mb-4 text-center text-2xl font-semibold text-gray-800">{verifyError}</h2>
                </div>
            </div>
        );
    }


    return (
        
        <div className="flex min-h-screen pb-8 flex-col justify-between bg-black">
            {/* Login Section */}
            <div className="flex flex-grow items-center justify-center px-4 py-8">
                <div className="flex w-full max-w-4xl flex-col overflow-hidden md:min-h-[60dvh] rounded-lg bg-white shadow-lg md:flex-row">
                    {/* Left side: Login Form */}
                    <div className="w-full p-5 md:p-8 md:w-1/2">
                        <h2 className="mb-6 text-3xl font-bold text-gray-700">Login to {clientName}</h2>

                        {/* Login Form */}
                        <form
                            onSubmit={handleFormSubmit}
                            className="space-y-3 mb-3"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter your Username"
                                    className="mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your Password"
                                    className="mt-1 block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {submitting ? <div className="flex items-center justify-center">
                                <Spinner className="h-8 w-8" />
                            </div> : <div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-md bg-indigo-500 px-4 py-3 font-semibold text-white hover:bg-indigo-600"
                                >
                                    Login
                                </button>
                            </div>}
                        </form>

                        <div className="flex items-center justify-center border border-black h-0 my-6">
                            <span className="px-3 bg-white">OR</span>
                        </div>

                        {/* Microsoft Login Button */}

                        <p className="text-gray-500 my-1">
                            Use <strong>&lt;kerberos&gt;@iitd.ac.in</strong> to login </p>
                        <div className="mt-3">
                            <MSLoginButton
                                client_id={client_id}
                                redirect_uri={redirect_uri}
                            />
                        </div>
                    </div>

                    {/* Right side: Image */}
                    <div className="flex w-full items-center justify-center p-4 md:w-1/2 md:p-2">
                        <img
                            src={logo}
                            alt="DevClub Logo"
                            className="h-32 object-contain md:h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
