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
	res.status(201).json({
		message: "User signed up successfully!",
		user: data.user,
	});
});

// Login endpoint
// Login endpoint
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) return res.status(400).json({ error: error.message });

	// Send session (access_token) back in response
	res.status(200).json({
		message: "User logged in successfully!",
		user: data.user,
		token: data.session.access_token, // Return the access token for future requests
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
	// console.log(`/auth/me endpoint has a token! It's: ${token}`);
	try {
		// Verify the token using Supabase's getUser function
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			console.log(error);
			return res
				.status(401)
				.json({ error: "Unauthorized, invalid or expired token" });
		}

		// If token is valid, send back user information
		res.status(200).json({ user: data.user });
		// console.log(`We sent back the user to the client GET request at /auth/me: ${data.user}`);
	} catch (err) {
		console.error("Error fetching user data:", err);
		res.status(500).json({ error: "Error fetching user data" });
	}
});

router.post("/googleAuth", async (req, res) => {
	console.log("Somebody's using sign in with google!");
	const token = req.body.token;
	const { data, error } = await supabase.auth.signInWithIdToken({
		provider: "google",
		token: token,
	});
	if (error) return res.status(400).json({ error: error.message });

	// Send session (access_token) back in response
	res.status(200).json({
		message: "User logged in successfully!",
		user: data.user,
		token: data.session.access_token, // Return the access token for future requests
	});
});

module.exports = router;
