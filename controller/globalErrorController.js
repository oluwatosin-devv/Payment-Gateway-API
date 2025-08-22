const AppError = require('../utils/AppError');

const handleAxiosError = (error) => {
  const message = `${error.response.data.message}`;
  return new AppError(message, 400);
};

const sendErrDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, req, res) => {
  //Operational, (trusted error -> error i created in my code )
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //programming or unknown errors : Dont leak details to the client

  //1) log error
  console.log('Error 💥💥', err);

  //2) send a generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'AxiosError') error = handleAxiosError(error);
    sendErrProd(error, req, res);
  }
};
