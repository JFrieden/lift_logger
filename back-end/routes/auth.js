const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

// Signup Endpoint
router.post("/signup", async (req, res) => {
	const { email, password } = req.body;
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) return res.status(400).json({ error: error.message });
	if (!data.user || data.user.role === "") {
		return res.status(400).json({
			error: "Failed to create account. Please try again with different email or password, or try again later.",
		});
	}

	return res.status(201).json({
		message:
			"User signed up successfully! Please confirm your email to complete the registration and then log in!",
		user: data.user,
	});
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) return res.status(400).json({ error: error.message });

	res.cookie("refresh_token", data.session.refresh_token, {

		secure: process.env.NODE_ENV === "production",

		httpOnly: true,
		sameSite: "strict",
		path: "/auth/refresh_token",
	});

	res.status(200).json({
		message: "User logged in successfully!",
		user: data.user,
		token: data.session.access_token,
	});
});

// Define /auth/me to fetch the authenticated user's details
router.get("/me", async (req, res) => {
	// Extract the token from the Authorization header
	const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
	if (!token) {
		return res
			.status(401)
			.json({ error: "Unauthorized, no token provided" });
	}
	try {
		// Verify the token using Supabase's getUser function
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			console.log(error);
			return res
				.status(401)
				.json({ error: "Unauthorized, invalid or expired token" });
		}

		res.status(200).json({ user: data.user });
	} catch (err) {
		console.error("Error fetching user data:", err);
		res.status(500).json({ error: "Error fetching user data" });
	}
});

router.post("/googleAuth", async (req, res) => {
	const token = req.body.token;
	const { data, error } = await supabase.auth.signInWithIdToken({
		provider: "google",
		token: token,
	});
	if (error) return res.status(400).json({ error: error.message });

	res.cookie("refresh_token", data.session.refresh_token, {
		httpOnly: true,

		secure: process.env.NODE_ENV === "production",

		sameSite: "strict",
		path: "/auth/refresh_token",
	});

	res.status(200).json({
		message: "User logged in successfully!",
		user: data.user,
		token: data.session.access_token,
	});
});

router.post("/refresh_token", async (req, res) => {
	const { refresh_token } = req.cookies;
	if (!refresh_token) {
		return res.status(401).json({ error: "Refresh token missing" });
	}

	const { data, error } = await supabase.auth.refreshSession({
		refresh_token,
	});

	if (error) {
		return res.status(401).json({ error: error.message });
	}

	// Update the refresh token in the cookie
	res.cookie("refresh_token", data.session.refresh_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Strict",
		path: "/auth/refresh_token",
	});

	res.json({
		access_token: data.session.access_token,
		user: data.user,
	});
});

module.exports = router;
