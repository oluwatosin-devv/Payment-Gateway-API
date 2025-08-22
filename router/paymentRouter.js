const express = require('express');
const { initiatePayment, paymentStatus } = require('../controller/paystack');

const router = express.Router();

router.post('/', initiatePayment);
router.get('/:id', paymentStatus);

module.exports = router;
