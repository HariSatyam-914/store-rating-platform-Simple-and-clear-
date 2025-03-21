import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await axios.post("http://localhost:5000/login", { email, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
