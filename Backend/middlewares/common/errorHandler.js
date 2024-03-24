// external import

// default error handler
const errorHandler = (err, req, res, next) => {
  res.locals.error = { message: err.message };

  res.status(err.status || 500);

  res.json(res.locals.error);
};

module.exports = {
  errorHandler,
};
