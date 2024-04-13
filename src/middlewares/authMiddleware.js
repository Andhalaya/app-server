const jwt = require('jsonwebtoken');
const {secret} = require('../crypto/config')

function generateToken(user) {
    return jwt.sign({user: user.id}, secret, {expiresIn: '1h'})
  }
  
function verifyToken(req, res, next) {
  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded.user;

        next();
    });
  }

module.exports = {generateToken, verifyToken}