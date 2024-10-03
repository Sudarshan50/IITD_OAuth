import { useEffect, useState } from "react";
import api from "../../components/api";
import { Spinner } from "@material-tailwind/react";
import Navbar from "../admin/navbar";

const SuperAdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        await api
            .get("/admin/adminLogs")
            .then((res) => {
                if (res.status === 200) {
                    setLogs(res.data.logs);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(88.4vh-1px)] bg-gray-900 p-4">
                {/* Logs Table */}
                <div className="container mx-auto">
                    <h2 className="mb-4 text-xl font-semibold text-white">Admin Activity Logs</h2>
                    <div className="overflow-x-auto rounded-lg bg-gray-800 shadow-md">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <Spinner
                                    color="white"
                                    size="lg"
                                />
                            </div>
                        ) : (
                            <table className="min-w-full text-left text-sm font-light text-white">
                                <thead>
                                    <tr className="bg-gray-700 text-sm uppercase leading-normal">
                                        <th className="px-6 py-3">S.No</th>
                                        <th className="px-6 py-3">Admin </th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Message</th>
                                        <th className="px-6 py-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {logs.map((log, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-600"
                                        >
                                            <td className="px-6 py-3">{logs.length - index}</td> {/* Serial No */}
                                            <td className="px-6 py-3">{log.adminId}</td> {/* Admin Username */}
                                            <td className="px-6 py-3">{log.action}</td> {/* Action */}
                                            <td className="px-6 py-3">{log.message}</td> {/* Message */}
                                            <td className="px-6 py-3">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>{" "}
                                            {/* Timestamp */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperAdminLogs;
