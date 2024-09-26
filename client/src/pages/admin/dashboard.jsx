import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import api from "../../components/api";
import { toast } from "react-toastify";

// Simulated client data

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
            <nav className="bg-blue-gray-900 p-4 text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="space-x-4">
                        <Button
                            className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-gray-900 hover:bg-yellow-500"
                            onClick={() => navigate("/admin/reg")}
                        >
                            Register New Client
                        </Button>
                        <Button
                            className="rounded-lg bg-red-400 px-4 py-2 font-semibold text-gray-900 hover:bg-red-500"
                            onClick={() => {
                                cookie.remove("adminToken");
                                navigate("/admin/signin");
                            }}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </nav>

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

