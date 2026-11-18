export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message,
  });
}