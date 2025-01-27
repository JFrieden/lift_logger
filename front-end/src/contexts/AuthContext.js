// ./contexts/AuthContext.js
import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
	useCallback,
} from "react";
import axios from "../axios_instance";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const [loginMessage, setLoginMessage] = useState("");

	// Flag to avoid multiple simultaneous refresh attempts
	const isRefreshingRef = useRef(false);
	const failedQueueRef = useRef([]);

	// Process queued requests after token refresh
	const processQueue = useCallback((error, token = null) => {
		failedQueueRef.current.forEach((prom) => {
			if (token) {
				prom.resolve(token);
			} else {
				prom.reject(error);
			}
		});
		failedQueueRef.current = [];
	}, []);

	// Axios request interceptor
	useEffect(() => {
		const requestInterceptor = axios.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("token");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		// Axios response interceptor for handling 401 errors
		const responseInterceptor = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					// Prevent duplicate refresh attempts
					if (isRefreshingRef.current) {
						return new Promise((resolve, reject) => {
							failedQueueRef.current.push({ resolve, reject });
						})
							.then((token) => {
								originalRequest.headers.Authorization = `Bearer ${token}`;
								return axios(originalRequest);
							})
							.catch((err) => Promise.reject(err));
					}

					originalRequest._retry = true;
					isRefreshingRef.current = true;

					try {
						// Refresh the token
						const refreshResponse = await axios.post(
							"/auth/refresh_token",
							{},
							{ withCredentials: true }
						);
						const newAccessToken =
							refreshResponse.data.access_token;

						// Update token in localStorage
						localStorage.setItem("token", newAccessToken);
						processQueue(null, newAccessToken);
						isRefreshingRef.current = false;

						// Retry the original request
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						return axios(originalRequest);
					} catch (refreshError) {
						processQueue(refreshError, null);
						isRefreshingRef.current = false;
						logout();
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			}
		);

		// Cleanup interceptors on unmount
		return () => {
			axios.interceptors.request.eject(requestInterceptor);
			axios.interceptors.response.eject(responseInterceptor);
		};
	}, [processQueue]);

	// Signup function
	const signUp = async (email, password) => {
		try {
			const response = await axios.post("/auth/signup", {
				email,
				password,
			});
			return response;
		} catch (error) {
			console.error(
				"Signup Error:",
				error.response?.data || error.message
			);
			return error.response;
		}
	};

	// Login function
	const login = async (email, password) => {
		try {
			const response = await axios.post("/auth/login", {
				email,
				password,
			});
			localStorage.setItem("token", response.data.token);
			setUser(response.data.user);
			setLoginMessage("Login Successful!");
			return true;
		} catch (error) {
			console.error("Login Error:", error.message);
			setLoginMessage(`Login Error: ${error.message}`);
			return false;
		}
	};

	// Google Login function
	const loginWithGoogle = async (googleResponse) => {
		try {
			const response = await axios.post("/auth/googleAuth", {
				token: googleResponse.credential,
			});
			localStorage.setItem("token", response.data.token);
			setUser(response.data.user);
			setLoginMessage("Google Auth Successful!");
			return true;
		} catch (error) {
			console.error("Google Login Error:", error.message);
			setLoginMessage(`Login Error: ${error.message}`);
			return false;
		}
	};

	// Logout function
	const logout = () => {
		setUser(null);
		localStorage.removeItem("token");
	};

	// Fetch authenticated user
	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await axios.get("/auth/me");
				setUser(response.data.user);
			} catch (error) {
				console.error("Error fetching authenticated user:", error);
				localStorage.removeItem("token"); // Clear invalid token
			} finally {
				setIsLoading(false);
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
