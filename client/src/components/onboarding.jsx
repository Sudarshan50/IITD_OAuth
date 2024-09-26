import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const OnboardingForm = () => {
    // State for the form fields
    const [formData, setFormData] = useState({
        hostel: "",
        dateOfBirth: "",
        instagramId: "",
        mobileNo: "",
        msId: Cookies.get("msId"),
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Form Data Submitted:", formData);
        try {
            const res = await axios.post("http://localhost:3000/api/oauth/onboarding", formData);
            console.log(res);
            if (res.status === 200) {
                window.location.href = `http://localhost:3000/api/oauth/verify?client_id=${Cookies.get("client_id")}&redirect_uri=${Cookies.get("redirect_uri")}`;
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen w-full overflow-hidden">
            <div className="mx-auto mt-64 max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">Onboarding Form</h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Hostel */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hostel</label>
                        <input
                            type="text"
                            name="hostel"
                            value={formData.hostel}
                            onChange={handleChange}
                            placeholder="Enter your hostel"
                            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
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
