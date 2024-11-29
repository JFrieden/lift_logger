// middlewares/authMiddleware.js
const supabase = require('../supabase');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token missing' });
    }

    try {
        // Use Supabase to validate the token
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Attach user info to the request object
        req.user = data.user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Token authentication error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateToken;
