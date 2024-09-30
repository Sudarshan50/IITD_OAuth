import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const UnAuthorised = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-[calc(94.84vh-1px)] flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-4 text-4xl font-bold text-blue-600">403 - Unauthorised</h1>
            <p className="mb-8 text-lg text-gray-700">You dont have permission to view this page.</p>
            <Button
                color="blue"
                className="animate-pulse"
                ripple="light"
                onClick={() => navigate("/")}
            >
                Go Back
            </Button>
        </div>
    );
};

export default UnAuthorised;
