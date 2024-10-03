import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../components/api";
import Navbar from "./navbar";
import { Spinner } from "@material-tailwind/react";

// Simulating a function to fetch client data (replace with your API call)

const EditClientForm = () => {
    const navigate = useNavigate();
    const { client_id } = useParams();
    const [clientData, setClientData] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchClientData = async () => {
        try {
            setLoading(true);
            api.get(`/admin/client/${client_id}`)
                .then((res) => {
                    if (res.status === 200) {
                        setClientData(res.data);
                        setClientData((prevData) => ({
                            ...prevData,
                            client_id: client_id,
                        }));
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                    toast.error("Failed to fetch client data");
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (err) {
            setLoading(false);
            toast.error("Failed to fetch client data");
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
                    autoClose: 2000,
                },
                error: {
                    render() {
                        return "Failed to update client";
                    },
                    autoClose: 2000,
                },
            })
            .then(() => {
                navigate("/admin/dashboard");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to update client");
            });
    };


    if (loading) {
        return (
            <div className="flex min-h-[calc(94.84vh-1px)] items-center justify-center overflow-hidden bg-black p-4">
                <Spinner className="h-12 w-12 text-white" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex min-h-[calc(94.84vh-1px)] items-center justify-center overflow-hidden bg-black p-4">
                {/* Form */}
                <div className="w-full max-w-lg rounded-lg bg-gray-900 px-3 py-6 shadow-md sm:p-8">
                    <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">Edit Client Details</h2>
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
