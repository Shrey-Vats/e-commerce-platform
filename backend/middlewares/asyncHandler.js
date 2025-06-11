// backend/middlewares/asyncHandler.js

// This middleware is used to wrap asynchronous route handlers.
// It catches any errors thrown by the async function and passes them
// to the next middleware (which should be your error handling middleware).
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
