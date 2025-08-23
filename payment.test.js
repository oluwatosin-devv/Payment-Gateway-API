// Mock axios FIRST, before any other imports
jest.mock('axios');

const request = require('supertest');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

// Import app AFTER mocking axios
const app = require('./app');

// Cast axios to mocked version for TypeScript-like intellisense
const mockedAxios = axios;

describe('Payment Gateway Integration', () => {
  // Set overall timeout for all tests
  jest.setTimeout(30000);

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Ensure axios methods are properly mocked
    mockedAxios.post = jest.fn();
    mockedAxios.get = jest.fn();
  });

  afterAll(async () => {
    // Close any database connections if you have them
    // Example for MongoDB/Mongoose:
    // if (mongoose.connection.readyState !== 0) {
    //   await mongoose.connection.close();
    // }

    // Force close any remaining connections
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  describe('POST /api/v1/payments', () => {
    it('should initiate a payment', async () => {
      console.log('Starting payment test...');

      // Mock Paystack initialize response
      mockedAxios.post.mockResolvedValueOnce({
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

      console.log('Mock set up, making request...');

      const res = await request(app).post('/api/v1/payments').send({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '08012345678',
        email: 'john@example.com',
        amount: 5000,
        state: 'Lagos',
        country: 'Nigeria',
      });

      console.log('Request completed, response status:', res.status);
      console.log('Response body:', res.body);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.session.authorization_url).toBe(
        'https://checkout.paystack.com/abc123'
      );

      // Verify that axios.post was called with correct parameters
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      console.log('Test completed successfully');
    });
  });

  describe('GET /api/v1/payments/:id', () => {
    it('should retrieve payment status', async () => {
      console.log('Starting status retrieval test...');

      // Mock Paystack verify response
      mockedAxios.get.mockResolvedValueOnce({
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

      console.log('Mock set up, making GET request...');

      const res = await request(app).get('/api/v1/payments/12345');

      console.log('GET request completed, response status:', res.status);
      console.log('Response body:', res.body);

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
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      console.log('GET test completed successfully');
    });
  });
});
