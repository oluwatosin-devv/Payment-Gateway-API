# Payment Gateway API

A RESTful API that enables small businesses to accept payments from customers using Paystack payment gateway. This API focuses on minimal customer information collection and provides a simple, secure payment processing solution.

## 🚀 Features

- **Simple Payment Processing**: Accept payments with minimal customer information
- **RESTful API Design**: Clean, versioned endpoints following REST best practices
- **Paystack Integration**: Secure payment processing through Paystack gateway
- **Transaction Status Tracking**: Real-time payment status monitoring
- **CI/CD Pipeline**: Automated testing and deployment
- **No Authentication Required**: Simplified integration for small businesses

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: Jest
- **Environment Management**: dotenv
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Payment Gateway**: Paystack

## 📋 Prerequisites

- Node.js (version 18.x, 20.x, or 22.x)
- npm package manager
- Paystack account and API keys

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# API Configuration
API_ENDPOINT=/api/v1
NODE_ENV=development
PORT=3000
```

### Getting Paystack API Keys

1. Sign up at [paystack.com](https://paystack.com)
2. Navigate to Settings → API Keys & Webhooks
3. Copy your Test/Live secret and public keys
4. Add them to your `.env` file

## 🚀 Running Locally

### 1. Clone the Repository

```bash

git clone https://github.com/oluwatosin-devv/Payment-Gateway-API
```

### 2. Install Dependencies

```bash

npm install
```

### 3. Set Up Environment Variables

```bash

cp .env.example .env
# Edit .env with your actual API keys
```

### 4. Start the Development Server

```bash
npm run start:DEV
```

The API will be available at `http://localhost:3000`

### 5. Verify Setup

Test the API is running:

```bash
curl http://localhost:3000/api/v1/payments
```

## 🧪 Testing

### Running Tests

The project uses Jest for integration testing with direct Paystack API testing:

```bash
# Run all tests
npm test
```

### Understanding Test Results

- ✅ **Pass**: API integration working correctly
- ❌ **Fail**: Check API keys, network connection, or Paystack service status

## 📡 API Documentation

### Base URL

```
Local: http://localhost:3000
Production: https://payment-gateway-api-eight.vercel.app
```

### API Version

All endpoints are versioned under `/api/v1`

---

### POST /api/v1/payments

**Initiate a payment transaction**

#### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+2348012345678",
  "amount": 10000,
  "state": "Lagos",
  "country": "Nigeria"
}
```

#### Response

```json
{
  "status": "success",
  "session": {
    "authorization_url": "https://checkout.paystack.com/.....",
    "access_code": "0umka32j4idyux9",
    "reference": "PAY-484-1755999610805"
  }
}
```

### GET /api/v1/payments/{id}

**Retrieve payment transaction status**

#### Response

```json
{
  "status": "success",
  "message": "Transaction details retrieved successfully.",
  "payment": {
    "customer_name": "Oni oluwatosin",
    "customer_email": "bookhizic@gmail.com",
    "amount": 2000,
    "status": "Declined"
  }
}
```

---

## 🚀 Deployment

### CI/CD Pipeline

The project uses GitHub Actions for automated testing and deployment to Vercel.

### Pipeline Workflow

1. **Code Push** → Triggers GitHub Actions
2. **Multi-Node Testing** → Tests on Node.js 18.x, 20.x, 22.x
3. **Integration Tests** → Direct Paystack API testing
4. **Test Pass** → Automatic Vercel deployment
5. **Test Fail** → Deployment blocked

### GitHub Secrets Required

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret                | Description             | How to Get                               |
| --------------------- | ----------------------- | ---------------------------------------- |
| `PAYSTACK_SECRET_KEY` | Paystack API secret key | Paystack Dashboard → Settings → API Keys |
| `VERCEL_TOKEN`        | Vercel deployment token | Vercel → Settings → Tokens               |
| `ORG_ID`              | Vercel organization ID  | Run `npx vercel link` locally            |
| `PROJECT_ID`          | Vercel project ID       | Run `npx vercel link` locally            |

### Code Quality

- Follow RESTful API conventions
- Maintain API versioning
- Write comprehensive tests
- Use meaningful commit messages
