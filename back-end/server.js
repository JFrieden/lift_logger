const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production")
	require("dotenv").config({ path: "../.env" });

const app = express();
app.use(cookieParser());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);

	res.header(
		"Cache-Control",
		"no-store, no-cache, must-revalidate, proxy-revalidate"
	);
	res.header("Pragma", "no-cache");
	res.header("Expires", "0");
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

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const movementRoutes = require("./routes/movements");
app.use(movementRoutes);

const liftLogRoutes = require("./routes/lift_logs");
app.use(liftLogRoutes);

const liftRoutes = require("./routes/lifts");
app.use("/lifts", liftRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.resolve(__dirname, "../front-end/build")));

	// Serve React frontend for all unknown routes
	app.get("*", (req, res) => {
		res.sendFile(
			path.resolve(__dirname, "../front-end/build", "index.html")
		);
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
