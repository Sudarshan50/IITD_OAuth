import { useState } from "react";
import api from "../../components/api";
import { toast } from "react-toastify";
import Navbar from "./navbar";

const ClientRegistrationForm = () => {
    const [clientName, setClientName] = useState("");
    const [redirectUris, setRedirectUris] = useState([""]);
    const [clientCred, setClientCred] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddRedirectUri = () => {
        if (redirectUris.length >= 5) {
            alert("You can add a maximum of 5 redirect URIs");
            return;
        }
        setRedirectUris([...redirectUris, ""]);
    };

    const handleRemoveRedirectUri = (index) => {
        if (redirectUris.length === 1) {
            alert("You must have at least one redirect URI");
            return;
        }
        const newUris = [...redirectUris];
        newUris.splice(index, 1);
        setRedirectUris(newUris);
    };

    const handleRedirectUriChange = (index, value) => {
        const newUris = [...redirectUris];
        newUris[index] = value;
        setRedirectUris(newUris);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await toast.promise(
                api.post("admin/register", {
                    client_name: clientName,
                    redirect_uris: redirectUris,
                }),
                {
                    pending: "Registering client...",
                    success: "Client registered successfully!",
                    error: "Failed to register client",
                }
            );
            if (res.status === 201) {
                setClientCred(res.data);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error registering client:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setClientName("");
        setRedirectUris([""]);
    };

    const handleDownload = () => {
        const dataStr = JSON.stringify(clientCred, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${clientCred?.client_name}_cred.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Navbar />
            <div className="flex min-h-[calc(94.84vh-1px)] items-center justify-center overflow-hidden bg-black p-2 sm:p-4">
                {/* Form */}
                <div className="w-full max-w-lg rounded-lg bg-gray-900 px-3 py-6 shadow-md sm:p-8">
                    <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">Add New Client</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Client Name */}
                        <div>
                            <label
                                className="mb-2 block font-semibold text-white"
                                htmlFor="clientName"
                            >
                                Client Name
                            </label>
                            <input
                                id="clientName"
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter client name"
                            />
                        </div>

                        {/* Redirect URIs */}
                        <div>
                            <label className="mb-2 block font-semibold text-white">Redirect URIs</label>
                            {redirectUris.map((uri, index) => (
                                <div
                                    key={index}
                                    className="mb-2 flex space-x-2"
                                >
                                    <input
                                        type="url"
                                        value={uri}
                                        onChange={(e) => handleRedirectUriChange(index, e.target.value)}
                                        required
                                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                        placeholder="Enter redirect URI"
                                    />
                                    <button
                                        type="button"
                                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                        onClick={() => handleRemoveRedirectUri(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                onClick={handleAddRedirectUri}
                            >
                                Add URI
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                            >
                                Register Client
                            </button>
                        </div>
                    </form>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative w-full max-w-lg rounded-lg bg-white p-4 shadow-lg sm:max-w-2xl sm:p-8">
                            <h2 className="mb-4 text-xl font-bold text-gray-800">Client Registered Successfully</h2>
                            <p className="mb-4">Here is your client secret. Please store it securely.</p>
                            <div className="font-mono rounded-lg bg-gray-100 p-4 text-gray-700">
                                <p>
                                    <strong>Client Name:</strong> {clientCred?.client_name}
                                </p>
                                <p>
                                    <strong>Client ID:</strong> {clientCred?.client_id}
                                </p>
                                <p>
                                    <strong>Client Secret:</strong> {clientCred?.client_secret}
                                </p>
                                <p>
                                    <strong>Redirect URIs:</strong> {clientCred?.redirect_uris?.join(", ")}
                                </p>
                                <p>
                                    <strong>Grants:</strong> {"authorization_code"}
                                </p>
                            </div>
                            <p className="mt-4 animate-pulse text-red-500">
                                ⚠️ Store this client secret securely. You will not be able to view it again.
                            </p>

                            {/* Download Button */}
                            <div className="mt-6 flex justify-between">
                                <button
                                    className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none"
                                    onClick={handleDownload}
                                >
                                    Download as JSON
                                </button>
                                <button
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ClientRegistrationForm;
