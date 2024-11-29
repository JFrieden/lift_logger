import axios from "axios";

const baseURL =
	process.env.NODE_ENV === "production"
		? "HEROKU_URL"
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
