import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-[calc(94.84vh-1px)] flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-4 text-4xl font-bold text-red-600">404 - Not Found</h1>
            <p className="mb-8 text-lg text-gray-700">The page you requested is not found.</p>
            <Button
                color="red"
                className="animate-pulse"
                ripple="light"
                onClick={() => navigate("/")}
            >
                Go Home
            </Button>
        </div>
    );
};

export default NotFound;
