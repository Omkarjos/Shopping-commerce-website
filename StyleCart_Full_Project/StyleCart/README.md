# StyleCart – Fashion E-commerce Demo

A beginner-friendly full-stack e-commerce starter project:
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MySQL
- Authentication: JWT + bcrypt
- Cart and checkout: server-side totals and stock validation
- Payment: Cash on Delivery / demo payment only (no real card data)

## Requirements
- Node.js 18+
- MySQL 8+
- npm

## 1. Create the database
Open MySQL Workbench or a MySQL terminal and run:
```sql
CREATE DATABASE stylecart;
```
Then import `database/schema.sql` followed by `database/seed.sql`.

## 2. Configure the backend
```powershell
cd backend
copy .env.example .env
npm install
```
Edit `backend/.env` and set your MySQL username/password and a long random JWT_SECRET.

Start the backend:
```powershell
npm run dev
```
API: http://localhost:5000
Health check: http://localhost:5000/api/health

## 3. Configure the frontend
Open a second VS Code terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## Demo admin account
The seed script creates products and categories only. Register a normal account first.
To make an account an admin, run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```
Log out and log in again so the JWT contains the updated role.

## Main API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/cart` (JWT required)
- `POST /api/cart/items` (JWT required)
- `PATCH /api/cart/items/:itemId` (JWT required)
- `DELETE /api/cart/items/:itemId` (JWT required)
- `POST /api/orders` (JWT required)
- `GET /api/orders/my` (JWT required)
- `GET /api/admin/orders` (admin required)

## Notes
This is a learning/demo project, not a production-ready store. Before production use, add payment-provider integration, email verification, password reset, image storage, comprehensive tests, logging, deployment hardening, and privacy/legal pages. Never store raw card details.
