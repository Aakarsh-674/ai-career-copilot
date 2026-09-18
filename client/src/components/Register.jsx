import { useState } from "react";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
    e.preventDefault();

    try {
    const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
            name,
            email,
            password
        }
    );

    setMessage(response.data.message);

} catch (error) {
    setMessage(error.response?.data?.message || "Something went wrong");
}
};

    return (
        <div>
            <h2>Register</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;