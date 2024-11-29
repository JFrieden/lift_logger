const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

if (process.env.NODE_ENV !== "production")
	require("dotenv").config({ path: "../.env" });
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

const authRoutes = require("./routes/auth"); // Import your auth routes
app.use("/auth", authRoutes); // All routes in authRoutes.js will now be prefixed with /auth

const movementRoutes = require("./routes/movements");
app.use(movementRoutes);

const liftLogRoutes = require("./routes/lift_logs");
app.use(liftLogRoutes);

const liftRoutes = require("./routes/lifts");
app.use("/lifts", liftRoutes);

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../front-end/build/index.html"));
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("build"));
	app.get("*", (req, res) => {
		res.sendFile(
			path.resolve(__dirname, "../front-end/build", "index.html")
		);
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
