import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LandingPage.css";

const Signup = () => {
	const { signUp } = useAuth();
	// const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [signupMessage, setSignupMessage] = useState("");
	const [signupSuccess, setSignupSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await signUp(email, password);
			if (response.data.user) {
				setSignupSuccess(true);
				setSignupMessage(response.data.message);
			} else {
				setSignupMessage(response.data.error);
			}
		} catch (error) {
			setSignupMessage(
				error.message || "Error signing up. Please try again."
			);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h2 className="text-2xl font-bold mb-4">Sign Up</h2>
			<form onSubmit={handleSubmit}>
				<input
					className="standard-input-box"
					type="email"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					className="standard-input-box"
					type="password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>

				<div className="auth-buttons">
					<button className="button sign-up" type="submit">
						Sign Up
					</button>
				</div>
			</form>
			{setSignupMessage && (
				<p
					style={{
						color: signupSuccess
							? "var(--default-green)"
							: "var(--default-red)",
						fontSize: "12px",
					}}
				>
					{signupMessage}

				</p>
			)}
			<p className="mt-4" style={{ marginTop: "15px" }}>
				Already have an account?{" "}
				<Link to="/login" className="text-blue-500">
					Log in here
				</Link>
			</p>
		</div>
	);
};

export default Signup;
