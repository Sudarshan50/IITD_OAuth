import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/RouteProtection";
import UnAuthorised from "./components/UnAuthorised";
import OnboardingForm from "./components/onboarding";
import MSSuccessPage from "./pages/MSSuccessPage";
import OauthInfo from "./pages/OauthInfo";
import SignIn from "./pages/OauthSignIn";
import AdminSignIn from "./pages/admin/SignIn";
import Dashboard from "./pages/admin/dashboard";
import ClientRegistrationForm from "./pages/admin/registeration";
import EditClientForm from "./pages/admin/updateClient";
import SuperAdminLogs from "./pages/superadmin/logs";

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

function App() {
    return (
        <MsalProvider instance={pca}>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/"
                        element={<OauthInfo />}
                    />
                    <Route
                        path="/signin"
                        element={<SignIn />}
                    />
                    {/* DONT REMOVE THIS ROUTE (It will be empty page) */}
                    <Route
                        path="/ms-success"
                        element={<MSSuccessPage />}
                    />
                    <Route
                        path="/onboarding"
                        element={<OnboardingForm />}
                    />

                    <Route
                        path="/admin/signin"
                        element={<AdminSignIn />}
                    />

                    {/* Admin Routes */}
                    <Route
                        path="admin"
                        element={<ProtectedRoute adminOnly={true} />}
                    >
                        <Route
                            path="reg"
                            element={<ClientRegistrationForm />}
                        />
                        <Route
                            path="edit_client/:client_id"
                            element={<EditClientForm />}
                        />
                        <Route
                            path="dashboard"
                            element={<Dashboard />}
                        />
                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                        <Route
                            path=""
                            element={<NotFound />}
                        />
                    </Route>

                    <Route
                        path="superadmin"
                        element={
                            <ProtectedRoute
                                adminOnly={false}
                                superAdminOnly={true}
                            />
                        }
                    >
                        <Route
                            path=""
                            element={<NotFound />}
                        />
                        <Route
                            path="logs"
                            element={<SuperAdminLogs />}
                        />
                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Route>

                    {/* Fallback Routes */}
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                    <Route
                        path="/unauthorised"
                        element={<UnAuthorised />}
                    />
                </Routes>
            </BrowserRouter>
            <footer className="fixed bottom-0 w-full bg-blue-gray-900 h-8 flex items-center justify-center text-center text-white">
                <p className="text-sm">&copy; {new Date().getFullYear()} DevClub. All rights reserved.</p>
            </footer>
        </MsalProvider>
    );
}

export default App;
