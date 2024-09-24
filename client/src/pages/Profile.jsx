import { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { Button } from "@material-tailwind/react";
const Profile = () => {
    const [user, setUser] = useState({});
    useEffect(() => {
        axios
            .post("http://localhost:3000/api/token/verify", {
                token: Cookie.get("access_token"),
                publicKey: import.meta.env.VITE_API_KEY,
            })
            .then((res) => {
                setUser(res.data.verifiedToken);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    const handleLogout = async() => {
        try{
            const res = await axios.get("http://localhost:3000/api/oauth/logout");
            if (res.status === 200) {
                Cookie.remove("access_token");
                Cookie.remove("refresh_token");
                window.location.href = "/login";
            }
        }catch(err)
        {
            console.log(err);
        }
    }

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button className="w-22 h-15 mr-44 ml-23 my-2 justify-center" onClick={handleLogout}> Log Out</Button>
                    <div className="col-span-1 md:col-span-2 lg:col-span-3"> 
                    <h1 className="text-2xl font-bold text-center  my-3 underline">Profile Info</h1>
                        <div className="rounded-lg bg-white p-8 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <h1>Kerberos: {user?.kerberos}</h1>
                                </div>
                                <h5>Name: {user?.user_name}</h5>
                                <h5>Email: {user?.email}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;

