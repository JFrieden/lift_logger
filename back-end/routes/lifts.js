const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const authenticateToken = require("../middleware/authMiddleware");

// CREATE: Add a new lift
router.post("/", authenticateToken, async (req, res) => {
	const { name, date } = req.body;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("lifts")
		.insert([
			{
				name,
				user_id: userId,
				date: new Date(date),
				created_at: new Date().toISOString(),
			},
		])
		.select();

	if (error) return res.status(400).json({ error: error.message });
	res.status(201).json({ message: "Lift created successfully", lift: data });
});

// READ: Get all lifts for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
	const userId = req.user.id;
	const { limit } = req.query; // Optional limit parameter

	let query = supabase.from("lifts").select("*").eq("user_id", userId);

	if (limit) {
		query = query
			.order("date", { ascending: false })
			.limit(parseInt(limit, 10));
	}

	const { data, error } = await query;
	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json(data);
});

// READ: Get a specific lift by ID
router.get("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("lifts")
		.select("*")
		.eq("id", id)
		.eq("user_id", userId)
		.single();

	if (error) return res.status(404).json({ error: "Lift not found" });
	res.status(200).json(data);
});

// UPDATE: Update a specific lift by ID
router.put("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { name, date } = req.body;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("lifts")
		.update({ name, date })
		.eq("id", id)
		.eq("user_id", userId);

	if (error) return res.status(400).json({ error: error.message });
	if (!data.length) return res.status(404).json({ error: "Lift not found" });

	res.status(200).json({ message: "Lift updated successfully", lift: data });
});

// DELETE: Delete a specific lift by ID
router.delete("/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("lifts")
		.delete()
		.eq("id", id)
		.eq("user_id", userId);

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json({ message: "Lift deleted successfully" });
});

module.exports = router;
