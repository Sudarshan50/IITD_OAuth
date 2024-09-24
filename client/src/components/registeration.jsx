// src/components/ClientRegistrationForm.js
import { useState } from "react";
import { Button, Input, Dialog, DialogFooter, DialogBody } from "@material-tailwind/react";
import axios from "axios";

const ClientRegistrationForm = () => {
    const [clientName, setClientName] = useState("");
    const [redirectUris, setRedirectUris] = useState([""]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientCred, setClientCred] = useState({});

    const handleRedirectUriChange = (index, value) => {
        const newRedirectUris = [...redirectUris];
        newRedirectUris[index] = value;
        setRedirectUris(newRedirectUris);
    };

    const handleAddRedirectUri = () => {
        setRedirectUris([...redirectUris, ""]);
    };

    const handleRemoveRedirectUri = (index) => {
        const newRedirectUris = redirectUris.filter((_, i) => i !== index);
        setRedirectUris(newRedirectUris);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const clientData = {
            client_name:clientName,
            redirect_uris:redirectUris,
        };
        const res = await axios.post("http://localhost:3000/api/admin/register", clientData);
        if (res.status === 201) {
            setClientCred(res.data);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 p-4 text-white">
                <h1 className="text-2xl">Admin Panel</h1>
            </header>
            <main className="p-6">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded bg-white p-6 shadow-md"
                >
                    <div>
                        <Input
                            label="Client Name"
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-4">
                        {redirectUris.map((uri, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4"
                            >
                                <Input
                                    label={`Redirect URI ${index + 1}`}
                                    type="url"
                                    value={uri}
                                    onChange={(e) => handleRedirectUriChange(index, e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {redirectUris.length > 1 && (
                                    <Button
                                        color="red"
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => handleRemoveRedirectUri(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            color="blue"
                            variant="outlined"
                            onClick={handleAddRedirectUri}
                        >
                            Add Redirect URI
                        </Button>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            color="green"
                        >
                            Register Client
                        </Button>
                    </div>
                </form>
                <Dialog
                    open={isModalOpen}
                    handler={setIsModalOpen}
                >
                    <DialogBody>
                        <h2 className="mb-4 text-xl font-semibold">Client Registered Successfully!</h2>
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
                            <strong>Public Key:</strong> {clientCred?.publicKey}
                        </p>
                        <p>
                            <strong>Redirect Uri(s):</strong> {clientCred?.redirect_uris}
                        </p>
                        <p className="mt-4 text-red-500">
                            Please store this information securely. It will not be shown again!
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            color="blue"
                            onClick={() => setIsModalOpen(false)}
                            ripple="light"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </Dialog>
            </main>
        </div>
    );
};

export default ClientRegistrationForm;

