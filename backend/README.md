# Sara Elegance API: E-Commerce Backend

**Student name:** HOCINE Sara
**Module:** WAMD, ENSTA, TD-TP 3: REST API with Node.js, Express.js, MongoDB, JWT, OAuth2, and rate limiting

## Description
This is the backend for the Sara Elegance women's fashion store (the frontend built in TD-TP 2 with React and Redux). It is a REST API built with Node.js, Express.js and MongoDB. It manages products and users, and provides authentication through both JWT and OAuth 2.0. It also implements rate limiting to protect against excessive requests and brute-force login attempts.

## Technologies used
- Node.js, Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- OAuth 2.0 (Google) for an alternative authentication method
- express-rate-limit for rate limiting
- cors, dotenv
- Postman for API testing

## Database models

**Product**
| Field | Type |
|---|---|
| name | String, required |
| description | String, required |
| price | Number, required |
| category | String, required |
| imageUrl | String, required |
| stock | Number, required |

**User**
| Field | Type |
|---|---|
| name | String, required |
| email | String, required, unique |
| passwordHash | String |

## API endpoints

### Authentication
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Authenticate and return a JWT | Public (max 5 requests / 15 min) |

### Products
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | /api/products | Retrieve all products | Public |
| GET | /api/products/:id | Retrieve one product | Public |
| POST | /api/products | Create a product | JWT or OAuth 2.0 token required |
| PUT | /api/products/:id | Update a product | JWT or OAuth 2.0 token required |
| DELETE | /api/products/:id | Delete a product | JWT or OAuth 2.0 token required |

General rate limit: 100 requests / 15 minutes on all `/api` routes.

**Status codes used:** 200, 201, 400, 401, 404, 409, 429, 500, with errors returned as `{ "success": false, "message": "..." }`.

## JWT authentication mechanism
1. On registration, the password is hashed with bcrypt before being stored (never in plain text). Duplicate emails are rejected with `409`.
2. On login, the credentials are checked against the stored hash. If valid, the server signs a JWT (`jsonwebtoken`) containing the user's id and email, using a secret stored in `JWT_SECRET` (environment variable, never hardcoded), valid for 1 hour.
3. Protected routes (create, update, delete product) are guarded by a middleware (`middleware/auth.js`) that reads the `Authorization: Bearer <token>` header, verifies the token, and either calls `next()` or returns `401 Unauthorized` if it's missing or invalid.
4. As an additional method, the same middleware also accepts a valid Google OAuth 2.0 access token, verified against Google's tokeninfo endpoint and checked against `GOOGLE_CLIENT_ID`.

## Installation and running the project

```bash
git clone https://github.com/hcnsara24/sara-elegance-api.git
cd sara-elegance-api
npm install
```

Create your `.env` file (see below), then:

```bash
npm run seed    # inserts 12 sample products into the database
npm run dev     # starts the server with nodemon (http://localhost:3000)
```

Or `npm start` to run it without auto-restart.

## MongoDB and environment variable configuration

1. Create a MongoDB database, either with MongoDB Atlas (cloud) or MongoDB Community Server (local).
2. Copy `.env.example` to a new file named `.env`.
3. Fill in your own values:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_local_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

`.env` is excluded from version control via `.gitignore` and must never be committed.

## API testing
All endpoints were tested with Postman, including: user registration and duplicate email handling, login with valid and invalid credentials, full product CRUD with a valid token, requests without a token or with an invalid token, invalid/non-existent product IDs, invalid product data, rate limiting (429 after repeated login attempts), and OAuth 2.0 authentication (Google access token accepted, request rejected without a token). Screenshots are in the `screenshots/` folder.
