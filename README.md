# Sara Elegance – Full-Stack E-Commerce Application

**Student name:** HOCINE Sara  
**Module:** WAMD – ENSTA (TP4)

Sara Elegance is a full-stack e-commerce web application developed using React, Redux, Node.js, Express, and MongoDB. The application allows users to browse products, register and log in, manage their shopping cart, and save their favorite products.

The application is deployed online, with the frontend hosted on GitHub Pages and the backend deployed on Render.

## Live Application

- **Frontend (Website):** https://hcnsara24.github.io/sara-elegance-fullstack/
- **Backend (API):** https://sara-elegance-fullstack.onrender.com

## Project Structure

This repository contains two main parts:

- **`/frontend`** – React application built with Vite and Redux.
- **`/backend`** – Node.js and Express REST API connected to MongoDB.

## Technologies Used

### Frontend
- React
- Vite
- Redux Toolkit
- Axios
- HTML and CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- REST API

### Deployment
- GitHub Pages – Frontend hosting
- Render – Backend hosting
- MongoDB – Database

## Features

- Display products retrieved from MongoDB.
- User registration and login.
- JWT-based authentication.
- Product management.
- Shopping cart management.
- Favorites management using Redux.
- REST API for communication between frontend and backend.
- Rate limiting and error handling.
- Online deployment of the frontend and backend.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/hcnsara24/sara-elegance-fullstack.git
cd sara-elegance-fullstack
```

### 2. Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and configure the required environment variables.

Then run:

```bash
npm run seed
npm run dev
```

The backend will run locally at:

`http://localhost:3000`

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

The frontend communicates with the backend REST API to retrieve products and handle authentication and other application features.

## Deployment

The application is deployed using the following services:

- **GitHub Pages:** Hosts the React frontend.
- **Render:** Hosts the Node.js and Express backend.
- **MongoDB:** Stores application data, including products and user information.

The deployed frontend communicates with the backend through its online REST API.

## Repository

GitHub: https://github.com/hcnsara24/sara-elegance-fullstack
