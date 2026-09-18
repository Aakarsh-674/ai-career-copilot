import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { setToken } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            setMessage(response.data.message);

            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);

            console.log(response.data);

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleLogin}>
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
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;