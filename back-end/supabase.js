const { createClient } = require("@supabase/supabase-js");

if (process.env.NODE_ENV !== "production")
	require("dotenv").config({ path: "../.env" });
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

module.exports = supabase;
