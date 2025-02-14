import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../components/api";
import Navbar from "./navbar";

const CreateUser = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        hostel: "",
        dateOfBirth: "",
        mobileNo: "",
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await toast.promise(
                api.post("admin/user", {
                    username: formData.username,
                    password: formData.password,
                    name: formData.name || undefined,
                    email: formData.email || undefined,
                    hostel: formData.hostel || undefined,
                    dateOfBirth: formData.dateOfBirth || undefined,
                    mobileNo: formData.mobileNo || undefined,
                }),
                {
                    pending: "Creating User...",
                    success: {
                        render() {
                            setFormData({ username: "", password: "", name: "", email: "", hostel: "", dateOfBirth: "", mobileNo: "" });
                            return "User cretaed successfully!"
                        }
                    },
                    error: {
                        render({ data }) {
                            console.log(data)
                            return data.response?.data || "Failed to create user";
                        },
                    }
                }
            );
        } catch (error) {
            console.error("Error registering client:", error);
        }
    };

    const handleCloseModal = () => {
    };

    const handleDownload = () => {
    };

    return (
        <>
            <Navbar />
            <div className="flex pb-8 items-center justify-center overflow-hidden bg-black p-2 sm:p-4">
                {/* Form */}
                <div className="w-full max-w-lg rounded-lg bg-gray-900 px-3 py-6 shadow-md sm:p-8">
                    <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">Add New User</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Username */}
                        <div>
                            <label
                                className="mb-2 block font-semibold text-white"
                                htmlFor="clientName"
                            >
                                Username *
                            </label>
                            <input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                type="text"
                                required
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block font-semibold text-white" htmlFor="password">Password *</label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                name="password"
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter password"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="mb-2 block font-semibold text-white" htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                name="name"
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block font-semibold text-white" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                name="email"
                                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
                                placeholder="Enter email"
                            />
                        </div>

                        {/* Hostel */}
                        <div>
                            <label className="mb-2 block font-semibold text-white" htmlFor="hostel">Hostel</label>
                            <select
                                id="hostel"
                                name="hostel"
                                className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={formData.hostel}
                                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                            >
                                <option
                                    value=""
                                    disabled
                                    selected={formData.hostel === ""}
                                >
                                    Select hostel
                                </option>
                                <option value="day_scholar">Day Scholar</option>
                                <option value="aravali">Aravali</option>
                                <option value="dronagiri">Dronagiri</option>
                                <option value="girnar">Girnar</option>
                                <option value="himadri">Himadri</option>
                                <option value="jwalamukhi">Jwalamukhi</option>
                                <option value="kailash">Kailash</option>
                                <option value="karakoram">Karakoram</option>
                                <option value="kumaon">Kumaon</option>
                                <option value="nalanda">Nalanda</option>
                                <option value="nilgiri">Nilgiri</option>
                                <option value="sahyadri">Sahyadri</option>
                                <option value="satpura">Satpura</option>
                                <option value="saptagiri">Saptagiri</option>
                                <option value="shivalik">Shivalik</option>
                                <option value="udaigiri">Udaigiri</option>
                                <option value="vindhyachal">Vindhyachal</option>
                                <option value="zanskar">Zanskar</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div className="mt-4 w-full">
                            <label className="mb-2 block font-semibold text-white" htmlFor="dateOfBirth">Date of Birth</label>
                            <LocalizationProvider
                                dateAdapter={AdapterDayjs}
                                adapterLocale={"en-gb"}
                            >
                                <DatePicker
                                    className="w-full bg-white text-black"
                                    value={dayjs(formData.dateOfBirth)}
                                    onChange={(newValue) =>
                                        setFormData({ ...formData, dateOfBirth: newValue?.format("YYYY-MM-DD") })
                                    }
                                // label="Enter DOB"
                                />
                            </LocalizationProvider>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateUser;
