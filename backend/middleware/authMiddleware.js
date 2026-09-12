const jwt = require ("jsonwebtoken");

const protect = (req, res, next) => {
  try{
    const token = req.cookies.token;
    
    if(!token){
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    const decode = jwt.verify(token, process.env.jwt_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = protect;
