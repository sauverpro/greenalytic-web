import jwt from "jsonwebtoken";

// Validate JWT configuration on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const tokengenerating = payload => {
  let token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP || '24h'
  });
  return token;
};

export const verifyingtoken = (req, res, next) => {
  try {
    let auth = req.headers.authorization;
    let token = auth?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "no access token provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message,
        });
      }
      
      req.userId = decoded.id;         // id from payload
      req.userEmail = decoded.email;   // email from payload
      req.username = decoded.username; // username from payload
      req.userRole = decoded.role;     // role from payload
      
      next();
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `internal server from verify token error: ${err.message}`
    });
  }
};