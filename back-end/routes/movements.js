const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const authenticateToken = require("../middleware/authMiddleware");

const checkIfMovementExists = async (name) => {
	console.log(`Checking ${name} for a database match`);
	try {
		const normalizedInput = name.trim().toLowerCase().replace(/\s+/g, "");

		const { data, error } = await supabase
			.from("movements")
			.select("id, name")
			.filter(`replace(lower(name), " ", "")`, "eq", normalizedInput);
		if (error) {
			console.error("Error querying supabase: ", error);
			return false;
		}
		return data.length > 0;
	} catch (err) {
		console.error("Error checking name existance: ", err);
		return false;
	}
};

// Create a new movement if there is not already a movement
// with this name (case and whitespace insensitive).
router.post("/movements", authenticateToken, async (req, res) => {
	const { name } = req.body;
	const userId = req.user.id;

	movementDNE = checkIfMovementExists(name);

	if (movementDNE) {
		const { data, error } = await supabase
			.from("movements")
			.insert([
				{
					name,
					user_id: userId,
					created_at: new Date().toISOString(),
				},
			])
			.select();

		if (error) {
			return res
				.status(error.status)
				.json({ error: error.error.message });
		}

		return res.status(201).json({
			message: "Movement created successfully",
			movement: data,
		});
	}
});

// Get ALL movements created by a user.
router.get("/movements", authenticateToken, async (req, res) => {
	// const userId = req.user.id;
	const { search } = req.query;

	let query = supabase.from("movements").select("*"); //.eq("user_id", userId);

	if (search) {
		query = query.ilike("name", `%${search}%`);
	}

	const { data, error } = await query;

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json(data);
});

// UPDATE: Update a specific movement by id
router.put("/movements/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;
	const userId = req.user.id;

	const { data, error } = await supabase
		.from("movements")
		.update({ name })
		.eq("id", id);
	// .eq('user_id', userId); // Ensure the movement belongs to the user

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json({
		message: "Movement updated successfully",
		movement: data,
	});
});

// DELETE: Delete a specific movement by id
router.delete("/movements/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;
	// const userId = req.user.id;

	const { data, error } = await supabase
		.from("movements")
		.delete()
		.eq("id", id);
	// .eq('user_id', userId); // Ensure the movement belongs to the user

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json({ message: "Movement deleted successfully" });
});

module.exports = router;
