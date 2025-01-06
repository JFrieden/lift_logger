import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LandingPage.css";

const LandingPage = () => {
	const { loginWithGoogle } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const handleGoogleLogin = async (response) => {
			const login_success = await loginWithGoogle(response);
			if (login_success) {
				navigate("/home");
			}
		};

		const initializeGoogleSignIn = () => {
			if (window.google) {
				window.google.accounts.id.initialize({
					client_id:
						"104767666315-lffbde79qrnva58f19gtm4j6jn4b9kvv.apps.googleusercontent.com",
					callback: handleGoogleLogin,
					auto_select: true,
				});
				window.google.accounts.id.renderButton(
					document.getElementById("g_id_signin"),
					{
						type: "standard",
						theme: "outline",
						size: "large",
						text: "signin_with",
						shape: "pill",
					}
				);
			}
		};

		// Load Google Sign-In script
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = initializeGoogleSignIn;
		document.body.appendChild(script);
	});

	const handleSignUp = () => navigate("/signup");
	const handleLogin = () => navigate("/login");

	return (
		<div className="landing-container">
			<header className="header">
				<h1>Lift Logger</h1>
				<p>
					Track your progress, build your strength, and achieve your
					fitness goals.
				</p>
			</header>
			<div className="auth-buttons">
				<button className="button sign-up" onClick={handleSignUp}>
					Sign Up
				</button>
				<button className="button login" onClick={handleLogin}>
					Log In
				</button>
				<div id="g_id_signin" className="google-signin-button"></div>
			</div>
		</div>
	);
};

export default LandingPage;
