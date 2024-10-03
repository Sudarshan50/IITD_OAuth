import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OnboardingForm = () => {
    // State for the form fields
    const token = new URLSearchParams(window.location.search).get("token");
    const [formData, setFormData] = useState({
        hostel: "",
        dateOfBirth: "",
        instagramId: "",
        mobileNo: "",
        token: token,
    });

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const payloadBase64 = token.split(".")[1];
            const payload = JSON.parse(atob(payloadBase64));
            setUsername(payload.username);
        } catch {
            console.log("Error decoding token");
            navigate("/unauthorised");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios
                .post("http://localhost:3000/api/auth/onboarding", formData)
                .then((res) => {
                    if (res.status === 200) {
                        window.location.href = `${res.data.redirect_uri}?code=${res.data.auth_code}&state=${res.data.state}`;
                    }
                })
                .catch((err) => {
                    toast.error(err.response?.data || "Error submitting form");
                });
        } catch (err) {
            console.log(err);
            toast.error("Error submitting form");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">Onboarding Form</h2>
                <p className="text-center text-gray-600">
                    Welcome <strong>{username}</strong>, please fill in the following details to complete your
                    onboarding.
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >
                    {/* Hostel */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hostel</label>
                        <select
                            name="hostel"
                            value={formData.hostel}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option
                                value=""
                                disabled
                            >
                                Select your hostel
                            </option>
                            <option value="aravali">Aravali</option>
                            <option value="girnar">Girnar</option>
                            <option value="jwalamukhi">Jwalamukhi</option>
                            <option value="karakoram">Karakoram</option>
                            <option value="kumaon">Kumaon</option>
                            <option value="nilgiri">Nilgiri</option>
                            <option value="shivalik">Shivalik</option>
                            <option value="satpura">Satpura</option>
                            <option value="udaigiri">Udaigiri</option>
                            <option value="vindhyachal">Vindhyachal</option>
                            <option value="zanskar">Zanskar</option>
                            <option value="dronagiri">Dronagiri</option>
                            <option value="saptagiri">Saptagiri</option>
                            <option value="kailash">Kailash</option>
                            <option value="sahyadri">Sahyadri</option>
                            <option value="himadri">Himadri</option>
                            <option value="nalanda">Nalanda</option>
                            <option value="saptagiri">Saptagiri</option>
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Instagram ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instagram ID</label>
                        <input
                            type="text"
                            name="instagramId"
                            value={formData.instagramId}
                            onChange={handleChange}
                            placeholder="Enter your Instagram ID"
                            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            pattern="[0-9]{10}"
                            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OnboardingForm;
