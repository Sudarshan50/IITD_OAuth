import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import api from "../../components/api";
import { toast } from "react-toastify";
import Navbar from "./navbar";

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const navigate = useNavigate();
    const fetchClients = async () => {
        try {
            const res = await toast.promise(api.get("/admin/clients"), {
                pending: { render: "Fetching Clients...", autoClose: 200 },
                success: { render: "Clients fetched successfully!", autoClose: 200 },
                error: { render: "Failed to fetch clients", autoClose: 200 },
            });
            setClients(res.data || []);
        } catch (error) {
            toast.error(`Failed to fetch clients: ${error.message}`, { autoClose: 2000 });
        }
    };
    useEffect(() => {
        fetchClients();
    }, []);
    const handleRemoveClient = async (client_id) => {
        const confirmed = window.confirm("Are you sure you want to remove this client?");
        if (confirmed) {
            try {
                await toast.promise(api.delete(`/admin/client/${client_id}`), {
                    pending: { render: "Removing client...", autoClose: 1000 },
                    success: { render: "Client removed successfully!", autoClose: 1000 },
                    error: { render: "Failed to remove client", autoClose: 1000 },
                });
                fetchClients();
            } catch (err) {
                toast.error(`Failed to remove client: ${err.message}`, { autoClose: 1000 });
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
                                                    onClick={() => navigate(`/admin/edit_client/${client.clientId}`)}
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
                    </div>
                </>
            </div>
        </div>
    );
};

export default Dashboard;
