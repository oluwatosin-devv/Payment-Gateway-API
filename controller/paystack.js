const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const axios = require('axios');

exports.initiatePayment = catchAsync(async (req, res, next) => {
  const { firstName, lastName, phoneNumber, email, amount, state, country } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !amount ||
    !state ||
    !country
  ) {
    return next(new AppError('Please provide required details', 400));
  }
  try {
    const session = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100,
        reference: `PAY-${Math.floor(Math.random() * 900) + 100}-${Date.now()}`,
        currency: 'NGN',
        metadata: {
          customer_name: `${firstName} ${lastName}`,
          customer_number: phoneNumber,
          customer_state: state,
          customer_country: country,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      status: 'success',
      session: session.data.data,
    });
  } catch (err) {
    if (err.response) {
      return next(err);
    }
  }
});

exports.paymentStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const status = await axios.get(
      `https://api.paystack.co/transaction/verify/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Transaction details retrieved successfully.',
      payment: {
        customer_name: status.data.data.metadata.customer_name,
        customer_email: status.data.data.customer.email,
        amount: status.data.data.amount / 100,
        status: status.data.data.gateway_response,
      },
    });
  } catch (err) {
    if (err.response?.status === 400) {
      return next(
        new AppError(`${err.response.data.message}`, err.response.status)
      );
    }
    next(err);
  }
});
