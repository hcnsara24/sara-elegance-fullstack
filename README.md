# Sara Elegance: Full-Stack E-Commerce Application

**Student name:** HOCINE Sara
**Module:** WAMD, ENSTA — TP4

This repository contains the complete full-stack application:

- **`/frontend`**: React + Redux e-commerce store (see `frontend/README.md`)
- **`/backend`**: Node.js + Express + MongoDB REST API (see `backend/README.md`)

## Running the project

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in your real values
npm run seed
npm run dev
```

### 2. Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and connects to the backend at `http://localhost:3000`.

## Features
Full product catalog from MongoDB, JWT authentication (register/login), OAuth 2.0 support, CRUD operations for products (create/delete from the frontend when logged in), shopping cart and favorites (Redux), rate limiting, and error handling throughout.
