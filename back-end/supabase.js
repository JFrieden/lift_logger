const { createClient } = require("@supabase/supabase-js");

const dotenv = require("dotenv").config();
dotenv.config({
	path: "../.env",
});
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

module.exports = supabase;
