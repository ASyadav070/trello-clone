const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Validates and parses (e.g., transforming numbers)
    next();
  } catch (error) {
    next(error); // Passes the ZodError to errorHandler
  }
};

module.exports = validateBody;
