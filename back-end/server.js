const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
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

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
