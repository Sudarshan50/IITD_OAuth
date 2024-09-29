import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../components/api";
import Navbar from "./navbar";

// Simulating a function to fetch client data (replace with your API call)

const EditClientForm = () => {
    const { client_id } = useParams();
    const navigate = useNavigate();
    const [clientData, setClientData] = useState({});

    const fetchClientData = async () => {
        try {
            const res = await api.get(`/admin/client/${client_id}`);
            if (res.status === 200) {
                setClientData(res.data);
                setClientData((prevData) => ({
                    ...prevData,
                    client_id: client_id,
                }));
            }
        } catch (err) {
            throw new Error(err);
        }
    };
    useEffect(() => {
        fetchClientData();
    }, [client_id]);

    const handleAddRedirectUri = () => {
        setClientData((prevData) => ({
            ...prevData,
            redirect_uris: [...prevData.redirect_uris, ""],
        }));
    };

    const handleRemoveRedirectUri = (index) => {
        if (clientData.redirect_uris.length === 1) {
            alert("At least one redirect URI is required");
            return;
        }
        const newUris = [...clientData.redirect_uris];
        newUris.splice(index, 1);
        setClientData((prevData) => ({
            ...prevData,
            redirect_uris: newUris,
        }));
    };

    const handleRedirectUriChange = (index, value) => {
        const newUris = [...clientData.redirect_uris];
        newUris[index] = value;
        setClientData((prevData) => ({
            ...prevData,
            redirect_uris: newUris,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast
            .promise(api.put(`/admin/client`, clientData), {
                pending: "Updating client...",
                success: {
                    render() {
                        return "Client updated successfully!";
                    },
                    autoClose: 500,
                },
                error: {
                    render() {
                        return "Failed to update client";
                    },
                    autoClose: 500,
                },
            })
            .then(() => {
                navigate("/admin/dashboard");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <Navbar />
            <div className="flex min-h-[calc(94.84vh-1px)] items-center justify-center overflow-hidden bg-black p-4">
                {/* Form */}
                <div className="w-full max-w-lg rounded-lg bg-gray-900 p-8 shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-white">Edit Client Details</h2>
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
                                value={clientData.client_name}
                                onChange={(e) =>
                                    setClientData((prevData) => ({
                                        ...prevData,
                                        client_name: e.target.value,
                                    }))
                                }
                                required
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter client name"
                            />
                        </div>

                        {/* Redirect URIs */}
                        <div>
                            <label className="mb-2 block font-semibold text-white">Redirect URIs</label>
                            {clientData?.redirect_uris?.length > 0 &&
                                clientData?.redirect_uris.map((uri, index) => (
                                    <div
                                        key={index}
                                        className="mb-2 flex space-x-2"
                                    >
                                        <input
                                            type="text"
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
                                Update Client
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditClientForm;
