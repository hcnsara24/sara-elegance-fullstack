function notFound(req, res) {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
  }
  
  function errorHandler(err, req, res, next) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({ success: false, message });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate value" });
    }
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ success: false, message: "Invalid JSON body" });
    }
  
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  
  module.exports = { notFound, errorHandler };