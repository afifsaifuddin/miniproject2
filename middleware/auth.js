const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access Denied!");
  }
  try {
    token = token.split(" ")[1];
    if (token === "null" || !token) {
      return res.status(401).send("Access Denied!");
    }
    let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
    if (!verifiedUser) {
      return res.status(401).send("Unauthorized request");
    }

    req.user = verifiedUser;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};
module.exports = { verifyToken };
