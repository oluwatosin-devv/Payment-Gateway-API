const express = require('express');
const morgan = require('morgan');
const paymentRouter = require('./router/paymentRouter');
const AppError = require('./utils/AppError');
const globalErrorController = require('./controller/globalErrorController');

const app = express();

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//bodyParser: reading data from body into req.body
app.use(express.json());

//routes
app.use(`${process.env.API_ENDPOINT}/payments`, paymentRouter);

app.use((req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.method} ${req.originalUrl} on this server`,
      400
    )
  );
});
app.use(globalErrorController);
module.exports = app;
