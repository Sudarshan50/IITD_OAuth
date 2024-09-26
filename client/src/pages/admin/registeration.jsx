import { useState } from "react";
import api from "../../components/api";
import { toast } from "react-toastify";

const ClientRegistrationForm = () => {
    const [clientName, setClientName] = useState("");
    const [redirectUris, setRedirectUris] = useState([""]);
    const [clientCred, setClientCred] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddRedirectUri = () => {
        setRedirectUris([...redirectUris, ""]);
    };

    const handleRemoveRedirectUri = (index) => {
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

    return (
        <>
            <div className="bg-blackp-4 flex min-h-[calc(94.84vh-1px)] items-center justify-center overflow-hidden bg-black">
                {/* Form */}
                <div className="w-full max-w-lg rounded-lg bg-gray-900 p-8 shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-white">Add New Client</h2>
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
                        <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
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
                                    <strong>Redirect URIs:</strong> {clientCred?.redirect_uris.join(", ")}
                                </p>
                                <p>
                                    <strong>Grants:</strong> {"authorization_code"}
                                </p>
                            </div>
                            <p className="mt-4 animate-pulse text-red-500">
                                ⚠️ Store this client secret securely. You will not be able to view it again.
                            </p>
                            <button
                                className="mt-6 w-full rounded-lg bg-green-500 py-2 text-white hover:bg-green-600 focus:outline-none"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ClientRegistrationForm;
