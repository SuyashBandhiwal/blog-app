// asyncHandler = har async controller ko try-catch me lapetne ka manual kaam khatam karta hai.
// Agar andar wale function me kahin bhi error/reject aata hai, wo seedha Express ke
// error-handling middleware (errorMiddleware.js) tak chala jata hai via next(err).
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler
