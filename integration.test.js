const request = require('supertest');
require('dotenv').config();
const app = require('./app');

describe('Paystack Integration Test', () => {
  it('should actually initiate a payment with Paystack', async () => {
    const res = await request(app).post('/api/v1/payments').send({
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '08011111111',
      email: 'testuser@example.com',
      amount: 5000,
      state: 'Lagos',
      country: 'Nigeria',
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.session.authorization_url).toContain(
      'https://checkout.paystack.com/'
    );
    expect(res.body.session.reference).toMatch(/PAY-/);
  });

  it('should retrieve payment status from Paystack', async () => {
    const reference = 'PAY-879-1755965699093';

    const res = await request(app).get(`/api/v1/payments/${reference}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.payment).toHaveProperty('amount');
    expect(res.body.payment).toHaveProperty('status');
  });
});
