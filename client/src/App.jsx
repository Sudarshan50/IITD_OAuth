import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ClientRegistrationForm from "./pages/admin/registeration";
import OnboardingForm from "./components/onboarding";
import AdminSignIn from "./pages/admin/SignIn";
import EditClientForm from "./pages/admin/updateClient";
import Dashboard from "./pages/admin/dashboard";
import NotFound from "./components/NotFound";
import UnAuthorised from "./components/UnAuthorised";
import SuperAdminLogs from "./pages/superadmin/logs";
import ProtectedRoute from "./components/RouteProtection";
import OauthInfo from "./pages/OauthInfo";

function App() {
    return (
        <>
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
                <footer className="relative bg-blue-gray-900 py-4 text-center text-white">
                    <p className="text-sm">&copy; {new Date().getFullYear()} DevClub. All rights reserved.</p>
                </footer>
            </BrowserRouter>
        </>
    );
}

export default App;
