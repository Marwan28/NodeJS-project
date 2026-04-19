# ITI E-Commerce Backend API

A RESTful e-commerce backend built with Node.js and Express.js as part of an ITI project. The API covers real shopping workflows including authentication, profile management, product browsing, carts, wishlists, reviews, promo codes, orders, and PayPal checkout.

## Features

- User registration and login
- Email confirmation with Nodemailer
- JWT-based authentication and admin authorization
- User profile and payment-method management
- Product and category APIs
- Guest and authenticated cart flows
- Wishlist management
- Product reviews and rating aggregation
- Promo code validation and discount handling
- Order creation, tracking, cancellation, and admin status updates
- PayPal payment link creation and cash-on-delivery support
- Ready-to-import Postman collection and environment

## Tech Stack

- Node.js
- Express.js
- Firebase Admin SDK
- Firebase Firestore
- Joi
- bcrypt
- jsonwebtoken
- Nodemailer
- PayPal Checkout Server SDK

## Project Structure

```text
.
|-- config/
|   |-- email-config.js
|   |-- firebase-config.js
|   `-- paypal-config.js
|-- .env.example
|-- features/
|   |-- users/
|   |-- profile/
|   |-- products/
|   |-- categories/
|   |-- cart/
|   |-- wishlist/
|   |-- reviews/
|   |-- promo_codes/
|   |-- order/
|   `-- payment/
|-- index.js
|-- package.json
|-- postman_collection.json
|-- postman_environment.json
`-- serviceAccountKey.json
```

## Prerequisites

- Node.js 20+ recommended
- npm
- Firebase service account credentials
- PayPal sandbox or live credentials
- Gmail account with an app password if email confirmation is enabled

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Marwan28/NodeJS-project.git
   cd NodeJS-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   On macOS/Linux:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Update `.env` with your own values.

5. Add your Firebase Admin credentials file at the project root:

   ```text
   serviceAccountKey.json
   ```

6. Start the server:

   ```bash
   npm start
   ```

The server runs on `http://localhost:3000` by default.

## .env File

This project includes a ready template at [`.env.example`](./.env.example).

Create a `.env` file from that template, then replace the placeholder values with your real credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
JWT_SECRET=iti
PORT=3000
FRONTEND_URL=http://localhost:3000
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox
```

### Environment Variable Details

- `EMAIL_USER`: Gmail address used to send confirmation emails.
- `EMAIL_PASS`: Gmail app password for the sender account.
- `JWT_SECRET`: included in the env template, but the current code still uses the hardcoded value `iti`.
- `PORT`: Express server port.
- `FRONTEND_URL`: used for PayPal success and cancel redirects.
- `PAYPAL_CLIENT_ID`: PayPal app client ID.
- `PAYPAL_CLIENT_SECRET`: PayPal app secret.
- `PAYPAL_MODE`: `sandbox` for testing or `live` for production.

## How to Use

After the server starts on `http://localhost:3000`, you can use the API in either Postman or any HTTP client.

### Quick Start with Postman

1. Import [postman_collection.json](./postman_collection.json).
2. Import [postman_environment.json](./postman_environment.json).
3. Set `baseUrl` to `http://localhost:3000`.
4. Run `Register`, then confirm the email using the `/confirm-email/:token` route.
5. Run `Login` and copy the returned JWT.
6. Send the JWT in the custom `token` header for protected routes.
7. For guest cart and guest checkout flows, send the `x-guest-id` header.

### Typical API Flow

1. Register a user with `POST /register`.
2. Confirm the email with `GET /confirm-email/:token`.
3. Log in with `POST /login`.
4. Browse products with `GET /products` and categories with `GET /categories`.
5. Add items to cart with `POST /cart`.
6. Optionally add items to wishlist with `POST /wishlist`.
7. Create a PayPal payment link with `POST /payment/create` or place an order with cash on delivery.
8. Place the order with `POST /orders`.
9. Track personal orders with `GET /orders/my`.

### Header Rules

- Use `token: <jwt>` for authenticated requests.
- Use `x-guest-id: <guest-id>` for guest cart and guest checkout requests.
- This project does not use the standard `Authorization: Bearer <token>` header.

## Important Request Notes

- Protected routes expect the JWT in a custom `token` request header.
- Guest cart and guest checkout flows use the `x-guest-id` header.
- PayPal success and cancel redirects are built from `FRONTEND_URL`.
- The current implementation signs and verifies JWTs with the hardcoded value `iti` in the code, even though `JWT_SECRET` exists in `.env`.

## Available Script

```bash
npm start
```

Runs the app with `nodemon index.js`.

## API Overview

| Module | Sample Endpoints | Access |
|---|---|---|
| Authentication | `POST /register`, `POST /login`, `GET /confirm-email/:token` | Public |
| Users | `GET /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id` | Admin |
| Profile | `GET /profile`, `POST /profile`, `PUT /profile`, `POST /profile/payment`, `DELETE /profile/payment/:paymentId` | Authenticated |
| Products | `GET /products`, `GET /products/:id` | Public |
| Product Management | `POST /products`, `PUT /products/:id`, `DELETE /products/:id` | Admin |
| Categories | `GET /categories`, `GET /categories/:id` | Public |
| Category Management | `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id` | Admin |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart/:productId`, `DELETE /cart/:productId`, `DELETE /cart` | Authenticated or guest |
| Wishlist | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:productId`, `GET /wishlist/check/:productId` | Authenticated |
| Reviews | `GET /products/:productId/reviews`, `GET /products/:productId/rating`, `GET /reviews`, `POST /reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id` | Mixed |
| Promo Codes | `GET /promo-codes`, `GET /promo-codes/:id`, `GET /promo-codes/code/:code`, `POST /promo-codes`, `PUT /promo-codes/:id`, `DELETE /promo-codes/:id` | Authenticated and admin-managed |
| Orders | `POST /orders`, `GET /orders/my`, `GET /orders/guest?email=...`, `GET /orders/:id`, `PATCH /orders/:id/cancel` | Mixed |
| Order Admin | `GET /orders`, `PATCH /orders/:id/status` | Admin |
| Payments | `POST /payment/create` | Authenticated or guest |

## Order and Payment Notes

- Supported payment methods are `paypal` and `cash_on_delivery`.
- Guest checkout requires `guestInfo` in the request body.
- Guest checkout also requires the `x-guest-id` header.
- PayPal checkout returns an approval URL that the frontend can redirect the user to.
- Promo codes are validated before order creation and decremented after a successful order.

## Postman

This repository includes:

- [postman_collection.json](./postman_collection.json)
- [postman_environment.json](./postman_environment.json)

Import both files into Postman to start testing the API quickly. The collection already includes environment variables for:

- `baseUrl`
- `token`
- `adminToken`
- `userId`
- `productId`
- `categoryId`
- `reviewId`
- `orderId`
- `paymentId`
- `promoCodeId`
- `guestId`
- `guestEmail`
- `paypalTransactionId`

## Response and Validation Behavior

- Request validation is handled with Joi.
- Passwords are hashed with bcrypt.
- Email confirmation tokens expire after 24 hours.
- Several business rules are enforced in controllers, such as stock checks, order status changes, and promo code validation.

## Future Improvements

- Move JWT signing and verification to `process.env.JWT_SECRET`
- Add automated tests
- Add centralized error handling middleware
- Add API documentation with Swagger or OpenAPI
- Add logging and rate limiting for production use

## Authors

Built as part of an ITI backend project by the team behind this repository.
