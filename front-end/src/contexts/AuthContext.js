// ./contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../axios_instance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const [loginMessage, setLoginMessage] = useState("");

	// Set up axios to include the token in every request
	axios.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	const signUp = async (email, password) => {
		try {
			const response = await axios.post("/auth/signup", {
				email,
				password,
			});
			return response;
		} catch (error) {
			console.error("Signup Error", error.response);
			return error.response;
		}
	};

	const login = async (email, password) => {
		try {
			const response = await axios.post("/auth/login", {
				email,
				password,
			});
			console.log("Setting new token!");
			localStorage.setItem("token", response.data.token);
			setUser(response.data.user);
			setLoginMessage("Login Success!");
			return true;
		} catch (error) {
			console.error("Login Error:", error.message);
			setLoginMessage(`Login Error: ${error.message}`);
			return false;
		}
	};

	const loginWithGoogle = async (googleResponse) => {
		try {
			const LLResponse = await axios.post("/auth/googleAuth", {
				token: googleResponse.credential,
			});
			localStorage.setItem("token", LLResponse.data.token);
			setUser(LLResponse.data.user);
			setLoginMessage("Google Auth Success!");
			return true;
		} catch (error) {
			console.error("Login Error: ", error.message);
			setLoginMessage(`Login Error: ${error.message}`);
			return false;
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("token");
	};

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await axios.get("/auth/me", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUser(response.data.user);
			} catch (error) {
				console.error("Error fetching authenticated user", error);
				localStorage.removeItem("token"); // Remove token if invalid
			} finally {
				setIsLoading(false); // Stop loading once the check is complete
			}
		};

		fetchUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				loginMessage,
				signUp,
				login,
				loginWithGoogle,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
