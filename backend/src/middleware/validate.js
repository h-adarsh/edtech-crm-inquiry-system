/**
 * Middleware factory to validate request parts (body, query, params) against Zod schemas.
 * Returns standard 400 Bad Request error format if validation fails.
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: formattedErrors[0]?.message || 'Validation failed',
          errors: formattedErrors,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload',
      });
    }
  };
};

