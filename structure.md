ecommerce-mern-tailwind/
├── package.json
├── structure.md
├── .env                         # Root-level for shared variables
├── README.md

├── backend/
│   ├── app.js
│   ├── package.json
│   ├── .env                    # For backend-specific env variables
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   └── utils/
│       └── generateToken.js

├── frontend/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│
│       ├── assets/
│       │   └── logo.svg
│
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   └── Loader.jsx
│
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── AdminDashboard.jsx
│
│       ├── context/
│       │   └── AuthContext.jsx
│
│       ├── hooks/
│       │   └── useAuth.js
│
│       ├── api/
│       │   └── apiClient.js
│
│       ├── utils/
│       │   └── helpers.js
│
│       ├── routes/
│       │   └── AppRoutes.jsx
│
│       └── layout/
│           ├── MainLayout.jsx
│           └── AdminLayout.jsx
