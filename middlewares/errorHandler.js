errorHandler = (error, req, res, defaultMessage, next) => {
  logger.error(error);
  console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
  console.error(error);

  if (!error.errorCode) {
    return res.status(400).json({ errorMessage: defaultMessage });
  } else {
    return res.status(error.errorCode).json({ errorMessage: error.errorMessage });
  }
}

module.exports = errorHandler;