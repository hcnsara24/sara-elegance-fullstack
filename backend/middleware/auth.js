const jwt = require("jsonwebtoken");

async function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    // not our own JWT, try OAuth below
  }

  if (process.env.GOOGLE_CLIENT_ID) {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`
      );
      if (response.ok) {
        const info = await response.json();
        if (info.aud === process.env.GOOGLE_CLIENT_ID) {
          req.user = { email: info.email, provider: "google" };
          return next();
        }
      }
    } catch (error) {
      // fall through
    }
  }

  return res.status(401).json({ success: false, message: "Invalid or expired token." });
}

module.exports = protect;
