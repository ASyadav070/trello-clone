const errorHandler = (err, req, res, next) => {
  // If the error comes from Zod validation
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  // Handle unique constraint violations or known pg errors
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists.' });
  }

  // For custom thrown errors from services
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Fallback to 500
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;
