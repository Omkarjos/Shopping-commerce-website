
# StyleCart – Fashion E-commerce Platform

StyleCart is a full-stack fashion e-commerce web application designed to provide a simple and user-friendly online shopping experience. Users can browse fashion products, view product details, manage their shopping cart, place orders, and track their order history.

The project is built using React.js, Node.js, Express.js, and MySQL.

## Features

- User registration and login
- JWT-based authentication
- Browse fashion products
- View individual product details
- Add products to the shopping cart
- Update product quantities and remove items
- Checkout with Cash on Delivery or demo payment
- View order history
- Backend REST API
- MySQL database integration
- Responsive user interface

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Vite

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt

### Database
- MySQL

## Project Structure

```text
StyleCart/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Omkarjos/StyleCart.git
cd StyleCart
```

### 2. Set Up the Database

1. Open MySQL Workbench or your MySQL terminal.
2. Create the database by importing `database/schema.sql`.
3. Import `database/seed.sql` to add sample products.
4. Check your database connection details.

### 3. Configure the Backend

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` and configure your database credentials and JWT secret.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stylecart
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

### 4. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

## Application Modules

| Module | Description |
|---|---|
| Authentication | User registration and login |
| Products | Browse and view fashion products |
| Shopping Cart | Add, update and remove products |
| Checkout | Place orders using demo checkout options |
| Orders | View order history |
| API | Handle frontend and backend communication |

## Security

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Environment variables for sensitive configuration

## Future Improvements

- Shopify integration
- Online payment gateway integration
- Product search and filtering
- Wishlist functionality
- Admin dashboard
- Product reviews and ratings
- Improved SEO and performance optimization

## Project Status

Developed as a full-stack learning project to practice frontend development, backend API development, database integration, and e-commerce workflows.

## Author

**Omkar Joshi**

- GitHub: https://github.com/Omkarjos
- LinkedIn: https://linkedin.com/in/omkar-joshi-93641b313
