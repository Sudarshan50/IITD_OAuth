import { MsalProvider, useMsal } from "@azure/msal-react";
import { useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import API from "./api";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const msalConfig = {
    auth: {
        clientId: `${import.meta.env.VITE_MS_CLIENT_ID}`,
        authority: `${import.meta.env.VITE_MS_AUTHORITY}`,
        redirectUri: `${import.meta.env.VITE_MS_REDIRECT_URI}`,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

const pca = new PublicClientApplication(msalConfig);

const MSLoginButtonImpl = ({ client_id, redirect_uri }) => {
    const { instance, inProgress } = useMsal();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleMSLogin = () => {
        instance
            .loginPopup({
                scopes: [`${import.meta.env.VITE_MS_SCOPES}`],
            })
            .then((response) => {
                setLoading(true);
                API.post(
                    "/auth/callback/microsoft",
                    { accessToken: response.accessToken, client_id, redirect_uri },
                    { withCredentials: false }
                )
                    .then((res) => {
                        if (res.status == 206) {
                            navigate(`/onboarding?token=${res.data.token}`);
                        } else if (res.status == 200) {
                            window.location.href = `${redirect_uri}?code=${res.data.auth_code}&state=${res.data.state}`;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error(err.response?.data?.message || "Error Logging in with Microsoft (Code: CB500)");
                    })
                    .finally(() => setLoading(false));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message || "Error Logging in with Microsoft (Code: MS500)");
                setLoading(false);
            });
    };
    return (
        <button
            onClick={handleMSLogin}
            className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            disabled={inProgress === "login" || loading}
        >
            <svg
                className="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 23 23"
            >
                <path
                    fill="#f3f3f3"
                    d="M0 0h23v23H0z"
                />
                <path
                    fill="#f35325"
                    d="M1 1h10v10H1z"
                />
                <path
                    fill="#81bc06"
                    d="M12 1h10v10H12z"
                />
                <path
                    fill="#05a6f0"
                    d="M1 12h10v10H1z"
                />
                <path
                    fill="#ffba08"
                    d="M12 12h10v10H12z"
                />
            </svg>
            Login with Microsoft
        </button>
    );
};

export const MSLoginButton = ({ client_id, redirect_uri }) => {
    return (
        <MsalProvider instance={pca}>
            <MSLoginButtonImpl
                client_id={client_id}
                redirect_uri={redirect_uri}
            />
        </MsalProvider>
    );
};

MSLoginButtonImpl.propTypes = {
    client_id: PropTypes.string.isRequired,
    redirect_uri: PropTypes.string.isRequired,
};

MSLoginButton.prototype = {
    client_id: PropTypes.string.isRequired,
    redirect_uri: PropTypes.string.isRequired,
};
