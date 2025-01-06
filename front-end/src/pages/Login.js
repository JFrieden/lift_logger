// ./pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const Login = () => {
	const { login, loginMessage } = useAuth(); // Access the login function from AuthContext
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await login(email, password); // Call the login function
		if (success) {
			navigate("/home"); // Redirect to home on successful login
		} else {
			console.error("Login failed:", loginMessage); // You can also display an error message here
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h2 className="text-2xl font-bold mb-4">Login</h2>
			<form onSubmit={handleSubmit} className="w-full max-w-sm">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="mb-4 w-full px-3 py-2 border rounded-md standard-input-box"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="mb-4 w-full px-3 py-2 border rounded-md standard-input-box"
					required
				/>
				<div
					style={{
						color:
							loginMessage === "Login Success!"
								? "var(--default-green)"
								: "var(--default-red)",
						fontSize: "12px",
					}}
				>
					{loginMessage}
				</div>
				<div className="auth-buttons">
					<button type="submit" className="button login">
						Log In
					</button>
				</div>
			</form>
		</div>
	);
};

export default Login;
