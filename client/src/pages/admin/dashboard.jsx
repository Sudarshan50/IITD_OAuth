import { useEffect, useState } from "react";
import { Button, Spinner, Tooltip, IconButton } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../components/api";
import { ClipboardIcon } from "@heroicons/react/20/solid";
import Navbar from "./navbar";

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/clients");
            setClients(res.data || []);
        } catch (error) {
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleRemoveClient = async (client_id) => {
        const confirmed = window.confirm("Are you sure you want to remove this client?");
        if (confirmed) {
            setLoading(true);
            try {
                await api.delete(`/admin/client/${client_id}`);
                toast.success("Client removed successfully!", { autoClose: 2000 });
                fetchClients();
            } catch (err) {
                toast.error(`Failed to remove client: ${err.message}`, { autoClose: 2000 });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCopyToClipboard = (clientId) => {
        navigator.clipboard.writeText(clientId);
        toast.info("Client ID copied to clipboard!", { autoClose: 1500 });
    };

    return (
        <div className="min-h-[calc(94.84vh-1px)] overflow-hidden bg-black">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto mt-8 p-4">
                <>
                    <h2 className="mb-4 text-xl font-semibold text-white">Available Clients</h2>
                    <div className="overflow-x-auto rounded-lg bg-blue-gray-100 p-6 shadow-md">
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <Spinner className="h-12 w-12" />
                            </div>
                        ) : (
                            <table className="min-w-full text-left text-sm font-light">
                                <thead>
                                    <tr className="bg-gray-400 uppercase">
                                        <th className="px-4 py-3">Client ID</th>
                                        <th className="px-4 py-3">Client Name</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {clients.length > 0 ? (
                                        clients?.map((client) => (
                                            <tr
                                                key={client.clientId}
                                                className="hover:bg-gray-300"
                                            >
                                                <td className="flex items-center space-x-2 px-4 py-3">
                                                    <span>{client.clientId.slice(0, 8)}...</span>
                                                    <Tooltip content="Copy Client ID">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue"
                                                            className="p-1 hover:bg-gray-200"
                                                            onClick={() => handleCopyToClipboard(client.clientId)}
                                                        >
                                                            <ClipboardIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                                <td className="px-4 py-3">{client.clientName}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                                                        <Button
                                                            className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                                                            onClick={() =>
                                                                navigate(`/admin/edit_client/${client.clientId}`)
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                                            onClick={() => handleRemoveClient(client.clientId)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center"
                                            >
                                                No clients available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            </div>
        </div>
    );
};

export default Dashboard;
