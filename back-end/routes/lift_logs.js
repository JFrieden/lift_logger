const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const authenticateToken = require("../middleware/authMiddleware");

// CREATE: Add a new lift log
router.post("/lift_logs", authenticateToken, async (req, res) => {
	const { lift_id, movement_id, movement_name, sets, reps, weight, notes } =
		req.body;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("lift_logs")
		.insert([
			{
				lift_id,
				movement_id,
				movement_name,
				sets,
				reps,
				weight,
				user_id: userId,
				notes,
			},
		])
		.select();

	if (error) return res.status(400).json({ error: error.message });
	res.status(201).json({
		message: "Lift log created successfully",
		lift_log: data[0],
	});
});

// READ: Get all lift logs for a specific lift
router.get("/lift_logs/:lift_id", authenticateToken, async (req, res) => {
	const { lift_id } = req.params;
	const userId = req.user.id;
	const { data, error } = await supabase
		.from("lift_logs")
		.select("*")
		.eq("lift_id", lift_id)
		.eq("user_id", userId);

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json(data);
});

// UPDATE: Update a specific lift log entry by id
router.put("/lift_logs/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { sets, reps, weight, notes } = req.body;
	const userId = req.user.id;
	const { data, error } = await supabase
		.from("lift_logs")
		.update({ sets, reps, weight, notes })
		.eq("id", id);

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json({
		message: "Lift log updated successfully",
		log: data,
	});
});

// DELETE: Delete a specific lift log entry by id
router.delete("/lift_logs/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("lift_logs")
		.delete()
		.eq("id", id);

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json({ message: "Lift log deleted successfully" });
});

module.exports = router;
