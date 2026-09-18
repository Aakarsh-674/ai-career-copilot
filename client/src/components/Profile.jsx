
import { useEffect, useState } from "react";
import api from "../api/axios";

function Profile() {

    const [user, setUser] = useState(null);

    const getProfile = async () => {
        try {
            const response = await api.get("/api/user/profile");

            setUser(response.data.user);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div>
            <h2>Profile</h2>

            {user && (
                <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;
