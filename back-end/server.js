const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production")
	require("dotenv").config({ path: "../.env" });

const app = express();
app.use(cookieParser());

// 🔄 Fix: Do NOT set Content-Type globally
app.use((req, res, next) => {
	if (!req.path.startsWith("/auth") && !req.path.startsWith("/api")) {
		res.header("Access-Control-Allow-Credentials", "true");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
	}
	next();
});

app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? "https://lift-logger-4b08aa94a99a.herokuapp.com"
				: "http://localhost:3000",
		optionsSuccessStatus: 200,
		credentials: true,
	})
);

app.use(express.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.resolve(__dirname, "../front-end/build")));

	// Serve React frontend for all unknown routes
	app.get("*", (req, res) => {
		res.sendFile(
			path.resolve(__dirname, "../front-end/build", "index.html")
		);
	});
}

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const movementRoutes = require("./routes/movements");
app.use(movementRoutes);

const liftLogRoutes = require("./routes/lift_logs");
app.use(liftLogRoutes);

const liftRoutes = require("./routes/lifts");
app.use("/lifts", liftRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
