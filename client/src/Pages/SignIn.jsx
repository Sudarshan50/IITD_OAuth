import { useState } from "react";
import logo from "../pages/devclub_logo.png";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
// import axios from "axios";

export function SignIn() {
    const handleMicrosoftSignIn = async () => {
        try {
            window.location.href = "http://localhost:3000/api/oauth/login?client_id=eea00f3408e61ed4d8ff7975caabe91ffdcdc83a&redirect_uri=http://localhost:5173";
        } catch (err) {
            console.log(err);
        }
    };
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

    return (
        <section className="grid h-screen items-center p-8 text-center">
            <div>
                <Typography
                    variant="h3"
                    color="blue-gray"
                    className="mb-2"
                >
                    Sign In
                </Typography>
                <Typography className="mb-16 text-[18px] font-normal text-gray-600">
                    Enter your email and password to sign in
                </Typography>
                <form
                    action="#"
                    className="mx-auto max-w-[24rem] text-left"
                >
                    <div className="mb-6">
                        <label htmlFor="email">
                            <Typography
                                variant="small"
                                className="mb-2 block font-medium text-gray-900"
                            >
                                Your Email
                            </Typography>
                        </label>
                        <Input
                            id="email"
                            color="gray"
                            size="lg"
                            type="email"
                            name="email"
                            placeholder="name@mail.com"
                            className="focus:border-t-primary w-full border-t-blue-gray-200 placeholder:opacity-100"
                            labelProps={{
                                className: "hidden",
                            }}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password">
                            <Typography
                                variant="small"
                                className="mb-2 block font-medium text-gray-900"
                            >
                                Password
                            </Typography>
                        </label>
                        <Input
                            size="lg"
                            placeholder="********"
                            labelProps={{
                                className: "hidden",
                            }}
                            className="focus:border-t-primary w-full border-t-blue-gray-200 placeholder:opacity-100"
                            type={passwordShown ? "text" : "password"}
                            icon={
                                <i onClick={togglePasswordVisiblity}>
                                    {passwordShown ? (
                                        <EyeIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    )}
                                </i>
                            }
                        />
                    </div>
                    <Button
                        color="gray"
                        size="lg"
                        className="mt-6"
                        fullWidth
                    >
                        sign in
                    </Button>
                    <div className="!mt-4 flex justify-end">
                        <Typography
                            as="a"
                            href="#"
                            color="blue-gray"
                            variant="small"
                            className="font-medium"
                        >
                            Forgot password
                        </Typography>
                    </div>
                    <Button
                        variant="outlined"
                        size="lg"
                        className="mt-6 flex h-12 items-center justify-center gap-2"
                        fullWidth
                        onClick={handleMicrosoftSignIn}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="h-6 w-10 mr-3 bg-cover"
                        />{" "}
                        Sign in with Devclub
                    </Button>
                    <Typography
                        variant="small"
                        color="gray"
                        className="!mt-4 text-center font-normal"
                    >
                        Not registered?{" "}
                        <a
                            href="#"
                            className="font-medium text-gray-900"
                        >
                            Create account
                        </a>
                    </Typography>
                </form>
            </div>
        </section>
    );
}

export default SignIn;

