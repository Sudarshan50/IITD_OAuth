import { useEffect, useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import api from "../../components/api";
import { toast } from "react-toastify";
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
                toast.success("Client removed successfully!", { autoClose: 1000 });
                fetchClients();
            } catch (err) {
                toast.error(`Failed to remove client: ${err.message}`, { autoClose: 1000 });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-[calc(94.84vh-1px)] overflow-hidden bg-black">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto mt-8 p-4">
                <>
                    <h2 className="mb-4 text-xl font-semibold">Available Clients</h2>
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
                                        <th className="px-4 py-3">Current Users</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {clients.length > 0 ? (
                                        clients?.map((client) => (
                                            <tr
                                                key={client.client_id}
                                                className="hover:bg-gray-300"
                                            >
                                                <td className="px-4 py-3">{client.clientId}</td>
                                                <td className="px-4 py-3">{client.clientName}</td>
                                                <td className="px-4 py-3">
                                                    {client?.current_users ? client?.current_users : 0}
                                                </td>
                                                <td className="space-x-4 px-4 py-3">
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
