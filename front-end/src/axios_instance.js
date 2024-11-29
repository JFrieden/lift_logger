import axios from "axios";

const baseURL =
	process.env.NODE_ENV === "production"
		? "https://lift-logger-4b08aa94a99a.herokuapp.com/"
		: "http://192.168.0.30:5000";

const instance = axios.create({
	baseURL: baseURL,
});

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export default instance;
