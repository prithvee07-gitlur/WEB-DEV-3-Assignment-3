const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = null;
    
    // Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Check Cookies (Fallback for Postman config in assignment)
    else if (req.headers.cookie) {
        const tokenCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
            token = tokenCookie.split('=')[1];
        }
    }

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
