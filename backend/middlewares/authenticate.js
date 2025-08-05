const jwt = require(`jsonwebtoken`);
require('dotenv').config();
const authenticate = (req , res , next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token)
    {
        return res.status(401).json({message :`Unauthorized access`});

    }
    try {
        const user = jwt.verify(token , process.env.SECRET_KEY );
        req.user = user;
        next();
    } catch(err) {
        return res.status(403).json({ message :`Invalid token` });
    }
};

module.exports = {authenticate};