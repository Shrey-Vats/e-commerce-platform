ecommerce-mern-tailwind/
├── package.json
├── structure.md
├── .env
├── README.md
├── backend/
│ ├── app.js
│ ├── package.json
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── bannerController.js
│ │ ├── orderController.js
│ │ └── productController.js
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ └── errorHandler.js
│ ├── models/
│ │ ├── Banner.js
│ │ ├── Order.js
│ │ ├── Product.js
│ │ └── User.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── bannerRoutes.js
│ │ ├── orderRoutes.js
│ │ └── productRoutes.js
│ └── utils/
│ └── generateToken.js
├── frontend/
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── postcss.config.js
│ ├── README.md
│ ├── tailwind.config.js
│ ├── vite.config.js
│ ├── public/
│ │ └── vite.svg
│ └── src/
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ ├── api/
│ │ └── apiClient.js
│ ├── components/
│ │ ├── Footer.jsx
│ │ ├── Loader.jsx
│ │ ├── Navbar.jsx
│ │ └── ProductCard.jsx
│ ├── context/
│ │ ├── AuthContext.jsx
│ │ └── CartContext.jsx
│ ├── hooks/
│ │ └── useAuth.js
│ ├── layout/
│ │ ├── AdminLayout.jsx
│ │ └── MainLayout.jsx
│ ├── pages/
│ │ ├── AdminDashboard.jsx
│ │ ├── Cart.jsx
│ │ ├── Checkout.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── OrderDetailsScreen.jsx
│ │ ├── OrderListScreen.jsx
│ │ ├── ProductDetails.jsx
│ │ ├── ProductEditScreen.jsx
│ │ ├── ProductListScreen.jsx
│ │ ├── Register.jsx
│ │ ├── UserListScreen.jsx
│ │ └── UserProfileScreen.jsx
│ ├── routes/
│ │ ├── AdminRoute.jsx
│ │ ├── AppRoutes.jsx
│ │ └── PrivateRoute.jsx
│ └── utils/
│ └── helpers.js
