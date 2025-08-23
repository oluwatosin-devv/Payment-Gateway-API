jest.mock('axios');
const axios = require('axios');
const request = require('supertest');
require('dotenv').config({ path: '.env' });
const app = require('./app');

describe('Payment Gateway Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any pending timers
    jest.useRealTimers();
  });

  describe('POST /api/v1/payments', () => {
    it('should initiate a payment', async () => {
      // Mock Paystack initialize response
      axios.post.mockResolvedValueOnce({
        data: {
          status: true,
          message: 'Authorization URL created',
          data: {
            authorization_url: 'https://checkout.paystack.com/abc123',
            access_code: 'ACCESS123',
            reference: 'PAY-123-4567890',
          },
        },
      });
      const res = await request(app).post('/api/v1/payments').send({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '08012345678',
        email: 'john@example.com',
        amount: 5000,
        state: 'Lagos',
        country: 'Nigeria',
      });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.session.authorization_url).toBe(
        'https://checkout.paystack.com/abc123'
      );
    });
  });
  describe('GET /api/v1/payments/:id', () => {
    it('should retrieve payment status', async () => {
      // Mock Paystack verify response
      axios.get.mockResolvedValueOnce({
        data: {
          status: true,
          data: {
            id: '12345',
            metadata: { customer_name: 'John Doe' },
            customer: { email: 'john@example.com' },
            amount: 50000,
            gateway_response: 'success',
          },
        },
      });

      const res = await request(app).get('/api/v1/payments/12345');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toBe(
        'Transaction details retrieved successfully.'
      );
      expect(res.body.payment).toEqual({
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        amount: 500,
        status: 'success',
      });
    });
  });
});
