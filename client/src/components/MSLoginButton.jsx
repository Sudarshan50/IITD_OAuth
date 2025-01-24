import { useMsal } from "@azure/msal-react";
import { Spinner } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "./api";

const MSSVG = () => (<svg
    className="mr-2 h-5 w-5 flex-shrink-0"
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
</svg>);

export const MSLoginButton = ({ client_id, redirect_uri }) => {
    const { instance, inProgress, accounts } = useMsal();
    const navigate = useNavigate();

    /**
     * 0: Not validating
     * 1: Validating
     * 2: Validated
     * 3: Error
     */
    const [validating, setValidating] = useState(0);

    const activeAccount = accounts.length > 0 ? accounts[0] : null;

    const handleMSLoginWithAccount = async (account) => {
        await instance
            .loginRedirect({
                account,
                scopes: [`${import.meta.env.VITE_MS_SCOPES}`],
            })
    }


    const handleMSLogin = async () => {
        await instance
            .loginRedirect({
                scopes: [`${import.meta.env.VITE_MS_SCOPES}`],
                prompt: "select_account"
            })
    };

    useEffect(() => {
        const init = async () => {
            await instance.initialize()
            setValidating(1);
            await instance.handleRedirectPromise().then(async (response) => {
                if (response && response.account) {
                    await api.post(
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
                            setValidating(3);
                            toast.error(err.response?.data?.message || "Error Logging in with Microsoft (Code: CB500)");
                        })
                } else {
                    setValidating(0);
                }
            }).catch((e) => {
                console.error(e);
                setValidating(3);
                toast.error("Error Logging in with Microsoft (Code: CB0UK)");
            })
        }
        init()
    }, [client_id, instance, navigate, redirect_uri])

    if (validating === 1 || inProgress === "login") {
        return (
            <div className="flex items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }
    return (
        <>
            {
                activeAccount ? (
                    <button
                        onClick={() => handleMSLoginWithAccount(activeAccount)}
                        className="flex w-full mb-3 items-center justify-center rounded-md bg-gray-700 px-4 py-3 font-semibold text-white hover:bg-gray-900"
                    >
                        <MSSVG />
                        <span className="line-clamp-1">Continue with {activeAccount.username}</span>
                    </button>
                ) : <></>
            }
            <button
                onClick={handleMSLogin}
                className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
                <MSSVG />
                {
                    activeAccount ? "Login with another account" :
                        "Login with Microsoft"}
            </button>
        </>
    );
};

MSLoginButton.propTypes = {
    client_id: PropTypes.string.isRequired,
    redirect_uri: PropTypes.string.isRequired,
};