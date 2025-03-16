const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const authenticateToken = require("../middleware/authMiddleware");
const natural = require("natural");
const levenshtein = require("fast-levenshtein");

/* HELPER FUNCTIONS */
const toTitleCase = (str) => {
	return str.replace(
		/\w\S*/g,
		(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);
};

// Determine a threshold based on input length. Longer inputs
// can have more errors or variations, so a higher threhshold.
const getNameLevenshteinThreshold = (name) => 1 + Math.trunc(name.length / 5);

const getPrefixKey = (name) => name.substring(0, 3).toLowerCase();

const normalizeName = (name) => natural.PorterStemmer.stem(name.toLowerCase());

const checkNameExists = async (name) => {
	const titleCasedName = toTitleCase(name);

	const searchKey = getPrefixKey(name);

	console.log("search key:", searchKey);

	let { data: potentialMatches, error: mvmntsError } = await supabase
		.from("movements")
		.select("name")
		.ilike("name_prefix_idx_key", `${searchKey}%`);

	if (mvmntsError) {
		console.error("Error fetching movements with prefix key:", error);
		return { warning: null };
	}

	if (potentialMatches.length === 0) {
		const { data, error } = await supabase.from("movements").select("name");

		if (error) {
			console.error("Error fetching from all movements:", error);
			return { warning: null };
		}
		potentialMatches = data;
	}

	const threshold = getNameLevenshteinThreshold(titleCasedName);
	console.log("Threshold:", threshold);
	// Levenshtein + Stemming for similarity check:
	let ret_val = null;
	let closest = threshold + 1;
	for (const { name: existingName } of potentialMatches) {
		// Fixed potenentialMatches -> potentialMatches
		console.log("Checking against:", existingName);
		const distance = levenshtein.get(
			normalizeName(titleCasedName),
			normalizeName(existingName)
		);
		console.log("|- Distance:", distance);
		if (titleCasedName === existingName) {
			return {
				warning: `'${existingName}' already exists.`,
				match: true,
				exactMatch: true,
			};
		}
		if (distance <= threshold && distance < closest) {
			closest = distance;
			ret_val = {
				warning: `A similar movement called '${existingName}' already exists. Are you sure you want to add '${titleCasedName}'?`,
				match: true,
				exactMatch: false,
			};
		}
	}
	if (ret_val) return ret_val;

	return { warning: null, match: false, exactMatch: false };
};

/* ROUTES  */

// CREATE: a new movement if there is not already a movement
// with a similar name as indicated by the checkNameExists Function
router.post("/movements", authenticateToken, async (req, res) => {
	const { name, forceCreate } = req.body;
	const userId = req.user.id;
	const formattedName = toTitleCase(name);
	const { warning, match, exactMatch } = await checkNameExists(formattedName);

	if (forceCreate || !match) {
		const { data, error } = await supabase
			.from("movements")
			.insert([
				{
					name: formattedName,
					name_prefix_idx_key: getPrefixKey(formattedName),
					user_id: userId,
					created_at: new Date().toISOString(),
				},
			])
			.select();

		if (error) {
			console.log(error);
			return res.status(500).json({ error: error.error });
		}

		return res.status(201).json({
			message: "Movement created successfully",
			movement: data[0],
		});
	} else {
		return res.status(409).json({
			warning: warning,
			requiresConfirmation: !exactMatch, //if exact match, we do not allow user to decide whether or not to add it.
		});
	}
});

// READ: ALL movements created by a user.
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
