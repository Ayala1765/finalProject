require('dotenv').config();
const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    console.log("😢😢😢😢😢💖😢🎶");    
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1];    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('JWT verification error:', err); // Log the error for debugging
            return res.status(403).json({ message: "Forbidden" })
        }      

        req.user = decoded
        next()
    })
}

module.exports = verifyJWT