import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import ClientRegistrationForm from "./components/registeration";

function App() {
    return (
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
                    path="/admin/reg"
                    element={<ClientRegistrationForm />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

