# Sholoana

Production-ready MERN photography portfolio with a React + Vite frontend and an Express + MongoDB Atlas backend.

## Structure

```text
sholoana/
  frontend/
  backend/
```

## Features

- Public image-first portfolio
- Fullscreen hero slider with motion
- Category-filtered gallery and lightbox
- JWT admin authentication via secure cookie
- Admin dashboard for uploads, categories, slider curation, about content, and testimonials
- MongoDB Atlas with Mongoose models
- `sharp` optimization before upload with Cloudinary storage for deployment-safe image hosting

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas database
## Installation

### 1. Backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and fill in the values.

`backend/env.json` is included as a plain JSON reference for the same required settings.

### 2. Frontend

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env` and set:

```bash
VITE_API_URL=/api
```

## Environment Variables

### Backend

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `COOKIE_NAME`
- `CLIENT_ORIGIN`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

### Frontend

- `VITE_API_URL`

## Default Admin Creation Flow

After backend env configuration:

```bash
cd backend
npm run seed
```

That creates:

- default categories: `Weddings`, `Events`, `Portraits`, `Models`
- the admin user from `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD`
- starter About content

## Running In Development

Start backend:

```bash
cd backend
npm run dev
```

Start frontend in a second terminal:

```bash
cd frontend
npm run dev
```

App URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

In development, Vite proxies `/api` and `/uploads` to the backend so admin auth works as same-origin in the browser.

## Production Build

Frontend build:

```bash
cd frontend
npm run build
```

Backend production start:

```bash
cd backend
npm start
```

Uploads flow:

1. Admin uploads images from the dashboard.
2. `multer` accepts image files in memory.
3. `sharp` rotates, resizes, and compresses them.
4. In deployed environments, the backend pushes optimized `.jpg` files to Cloudinary.
5. In local development, uploads can still fall back to `backend/uploads/`.
6. MongoDB saves image metadata and category relation.

## Vercel Deployment

This repo is configured for a single Vercel project from the repository root:

- `frontend/` builds as the static React app
- `backend/api/index.js` runs the Express API as a Vercel serverless function
- `vercel.json` routes `/api/*` requests to the backend and all other routes to the frontend SPA

Before deploying on Vercel, set these project environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `COOKIE_NAME`
- `CLIENT_ORIGIN`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

Use your Vercel frontend domain as `CLIENT_ORIGIN`.

## Main API Surface

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/images`
- `POST /api/images/upload`
- `PUT /api/images/:id`
- `DELETE /api/images/:id`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/slider`
- `PUT /api/slider`
- `GET /api/content`
- `GET /api/content/dashboard`
- `PUT /api/content/about`
- `POST /api/content/testimonials`
- `PUT /api/content/testimonials/:id`
- `DELETE /api/content/testimonials/:id`

## Notes

- The frontend includes a fallback content set so the public site can still render while backend credentials are not configured.
- Admin routes require backend auth and a working database connection.
# sholoanarchobi
# sholoanar
