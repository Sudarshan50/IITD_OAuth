import { useState, useEffect } from "react";
import { Button, Tooltip, IconButton, Alert } from "@material-tailwind/react";
import { SunIcon, MoonIcon, ClipboardIcon } from "@heroicons/react/20/solid";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme for code highlighting
import { useNavigate } from "react-router-dom";

// Sample OAuth code snippet
const codeSnippet = `app.get("/callback", async (req, res) => {
    const { code, state } = req.query;
    
    // Validate incoming parameters
    if (!code || !state) {
        return res.status(400).json({ message: "Missing code or state in the request." });
    }

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const grant_type = "authorization_code";

    // Ensure environment variables are set
    if (!client_id || !client_secret) {
        console.error("Client ID or Client Secret not configured.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    try {
        // Make a request to auth server to verify the auth_code and request for resources with the available grant type
        const response = await axios.post("http://localhost/api/auth/auth_verify", {
            client_id,
            client_secret,
            auth_code: code,
            state,
            grant_type,
        });

        // Check the response status and write the token logic accordingly...
        if (response.status === 200) {
            const token = jwt.sign(
                { user: response.data.user },
                process.env.APP_SECRET,
                { expiresIn: "1h" }
            );
            res.cookie("token", token);
            return res.redirect("http://localhost:5174"); // Redirect to the your application's home page
        } else {
            console.error("Error during authentication:", response.data.message);
            return res.status(response.status).json({ message: "Error during authentication." });
        }
    } catch (err) {
        // Log detailed error information
        console.error("Error during OAuth callback:", err.message || err);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});`;

const OauthInfo = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const navigate = useNavigate();

    // Function to handle theme toggle
    const handleToggle = () => {
        setDarkMode(!darkMode);
    };

    // Function to copy code to clipboard
    const copyToClipboard = (event) => {
        event.stopPropagation(); // Prevent event bubbling to avoid unwanted scroll
        navigator.clipboard.writeText(codeSnippet).then(() => {
            setAlertVisible(true);
            setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds
        });
    };

    // Highlight the code syntax when the component mounts
    useEffect(() => {
        Prism.highlightAll();
    }, [darkMode]);

    // Dynamic heading color based on the mode
    const headingColor = darkMode ? "text-sky-400" : "text-cerulean-500"; // Using Tailwind CSS color classes

    return (
        <div
            className={`${darkMode ? "bg-[#121212] text-gray-300" : "bg-gray-50 text-gray-800"} min-h-screen font-sans transition-all`} // Set a nice font family
        >
            {/* Enhanced Navbar */}
            <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 px-1 py-2 shadow-lg sm:p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="pl-3 text-sm font-bold text-white sm:pl-0 sm:text-2xl md:text-3xl">
                        OAuth Documentation
                    </h1>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Tooltip
                            content={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            placement="bottom"
                        >
                            <IconButton
                                onClick={handleToggle}
                                className="h-9 bg-white text-gray-900 transition-all hover:bg-gray-100"
                            >
                                {darkMode ? (
                                    <SunIcon className="h-5 w-5 text-yellow-400" />
                                ) : (
                                    <MoonIcon className="h-5 w-5 text-blue-400" />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Button
                            className="rounded-lg bg-white px-4 py-2 text-gray-900 shadow-md"
                            onClick={() => {
                                navigate("/admin/signin");
                            }}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto p-3 lg:p-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
                    {/* Why this OAuth Section */}
                    <div
                        className={`${darkMode ? "bg-[#1f1f1f] text-gray-300" : "bg-white text-gray-900"} rounded-lg p-4 shadow-lg transition-all lg:p-6`}
                    >
                        <h2 className={`mb-4 text-base font-bold md:text-2xl md:font-semibold ${headingColor}`}>
                            Why Choose This OAuth System?
                        </h2>
                        <p className="mb-4 text-sm leading-relaxed md:text-base">
                            The IITD OAuth initiative took significant time to receive approval from the CSC, and it
                            comes with certain limitations. This OAuth system streamlines the authentication process,
                            placing the security burden on a robust framework while allowing you to concentrate on
                            developing your application seamlessly.
                        </p>
                        <p className="mb-4 text-sm leading-relaxed md:text-base">
                            With this OAuth solution, user authentication becomes straightforward, enhancing both
                            scalability and security. Rely on it for an efficient and easy-to-implement solution that
                            elevates your application&apos;s user experience.
                        </p>
                    </div>

                    {/* How to Use Section */}
                    <div
                        className={`${darkMode ? "bg-[#1f1f1f] text-gray-300" : "bg-white text-gray-900"} rounded-lg p-4 shadow-lg transition-all lg:p-6`}
                    >
                        <h2 className={`mb-4 text-base font-bold md:text-2xl md:font-semibold ${headingColor}`}>
                            How to Get Started
                        </h2>
                        <p className="mb-4 text-sm leading-relaxed md:text-base">
                            After logging in, this OAuth returns user data directly. If a user signs in for the first
                            time, be sure to store their information in your database and implement your token logic
                            appropriately. Upon successful registration, you will receive a <strong>client_id </strong>
                            and <strong>client_secret</strong>.
                        </p>
                        <p className="mb-4 text-sm leading-relaxed md:text-base">
                            To register your client, follow the provided link to obtain your credentials. The login
                            request should look like this:
                            <code
                                className={`${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} mt-2 block rounded-lg p-2`}
                            >
                                authServerUrl/signin/?client_id=&lt;client_id&gt;&redirect_uri=&lt;redirect_uri&gt;
                            </code>
                        </p>
                        <p
                            className={`${darkMode ? "bg-[#1f1f1f] text-gray-300" : "bg-white text-gray-900"} text-sm leading-relaxed md:text-base`}
                        >
                            Handle the callback request effectively and manage the token flow as demonstrated in the
                            example code below.
                        </p>
                    </div>

                    {/* Code Block with Syntax Highlighting and Copy Button */}
                    <div className="col-span-1 rounded-lg bg-[#1f1f1f] px-2 py-3 shadow-lg transition-all md:col-span-2 md:p-6">
                        <h2 className={`mb-4 text-xl font-semibold text-white md:text-2xl`}>
                            Example Code Implementation
                        </h2>
                        <div className="relative rounded-lg bg-gray-900 p-2 text-white md:p-4">
                            <pre className="language-javascript">
                                <code>{codeSnippet}</code>
                            </pre>
                            <div className="absolute right-2 top-2 flex items-center">
                                {" "}
                                {/* Added flex container for better alignment */}
                                <Tooltip
                                    content="Copy Code"
                                    placement="top" // Tooltip positioned above the button
                                    className="bg-gray-700 text-sm text-white" // Custom styling for the tooltip
                                >
                                    <IconButton
                                        onClick={copyToClipboard}
                                        color="blue-gray"
                                        className="rounded-full bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <ClipboardIcon className="h-5 w-5" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert for successful copy */}
            {alertVisible && (
                <div className="fixed bottom-4 right-4">
                    <Alert color="green">Code copied successfully!</Alert>
                </div>
            )}
        </div>
    );
};

export default OauthInfo;
