const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (errorHandler)
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if status is 200 (meaning no error status was set yet)
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found`;
    statusCode = 404;
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Send stack trace only in development
  });
};

export { notFound, errorHandler };
