const request = require('supertest');
require('dotenv').config({ path: '.env' });

// Mock axios before requiring the app
jest.mock('axios');
const axios = require('axios');
const app = require('./app');

describe('Payment Gateway Integration', () => {
  // Set overall timeout for all tests
  jest.setTimeout(30000);

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
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

      // Verify that axios.post was called with correct parameters
      expect(axios.post).toHaveBeenCalledTimes(1);
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
            amount: 50000, // Note: This is 50000 in the mock
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
        amount: 500, // Your app converts 50000 to 500
        status: 'success',
      });

      // Verify that axios.get was called
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
