import axios from "axios";

const baseURL =
	process.env.NODE_ENV === "production"
		? "https://lift-logger-4b08aa94a99a.herokuapp.com/"
		: "http://localhost:5000";

const instance = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

export default instance;
