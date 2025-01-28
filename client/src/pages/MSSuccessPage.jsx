import { Spinner } from "@material-tailwind/react";
import { useEffect } from "react";

function MSSuccessPage() {
    useEffect(() => {
        const timeout = setTimeout(() => {
            alert("Some error occured while authenticating")
            window.history.back();
        }, 1000 * 60 * 1) // 1 minute
        return () => {
            clearTimeout(timeout)
        }
    }, [])
    return (
        <div className="flex min-h-screen pb-8 items-center justify-center bg-gray-500">
            <div className="flex items-center justify-center rounded-xl bg-white p-8 shadow-2xl">
                <Spinner className="h-12 w-12" />
            </div>
        </div>
    )
}

export default MSSuccessPage
