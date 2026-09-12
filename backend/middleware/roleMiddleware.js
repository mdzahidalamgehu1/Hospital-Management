const authorize = (...allowRoles) => {
  return(req, res, next) => {
    if(!req.user){
      return res.status(401).json({
        Message: "Not authenticated"
      });
    }
    if(!allowRoles.includes(req.user.role)){
      return res.status(403).json({
        Message: "Access denied"
      });
    }
    next();
  };
};

module.exports = authorize;