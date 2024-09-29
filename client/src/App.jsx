import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import ClientRegistrationForm from "./pages/admin/registeration";
import OnboardingForm from "./components/onboarding";
import AdminSignIn from "./pages/admin/SignIn";
import EditClientForm from "./pages/admin/updateClient";
import Dashboard from "./pages/admin/dashboard";
import NotFound from "./components/NotFound";
import UnAuthorised from "./components/UnAuthorised";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Profile />}
                    ></Route>
                    <Route
                        path="/signin"
                        element={<SignIn />}
                    />
                    <Route
                        path="/onboarding"
                        element={<OnboardingForm />}
                    />
                    <Route
                        path="/admin/reg"
                        element={<ClientRegistrationForm />}
                    />
                    <Route
                        path="admin/signin"
                        element={<AdminSignIn />}
                    />
                    <Route
                        path="admin/edit_client/:client_id"
                        element={<EditClientForm />}
                    />
                    <Route
                        path="admin/dashboard"
                        element={<Dashboard />}
                    />
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                    <Route
                        path="/unauthorised"
                        element={<UnAuthorised />}
                    />
                </Routes>
                <footer className="bg-blue-gray-900 py-4 text-center text-white">
                    <p className="text-sm">
                        Powered by <span className="font-bold">DevClub</span>
                    </p>
                </footer>
            </BrowserRouter>
        </>
    );
}

export default App;
