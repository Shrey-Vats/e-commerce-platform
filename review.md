## 🛠️ Seller Dashboard Integration Plan (MERN + Tailwind)

---

### ✅ Goal  
Shift product management from Admin → Seller and build a full-featured Seller Dashboard.

---

## 🔧 1) Admin Dashboard Improvements

### 🔹 Promote User to Seller
- Add a "Make Seller" button in User Management UI.
- Backend:
  - Add `isSeller: Boolean` in user model.
  - Route: `PATCH /api/users/:id/make-seller` (admin only).
  - Update JWT payload to include `isSeller`.

### 🔹 Transfer Product Upload Power
- Remove product creation UI from Admin (optional).
- Allow product CRUD only if `user.isSeller === true`.

---

## 🧑‍💻 2) Seller Dashboard Features

### 🔹 Dashboard Sections
- ➕ Add Product
- 📦 Manage Products
- 🛒 My Orders
- 💸 My Earnings
- 📷 Media Manager (images/videos)
- ⚙️ Settings

---

### 🔹 Add / Edit Product Form
- Fields: `title`, `price`, `stock`, `description`, `category`, etc.
- **Media Upload**:
  - Multiple Images (JPEG, PNG)
  - Multiple Videos (MP4/WebM)
  - Drag-and-drop support
  - Allow rearranging images/videos order

---

### 🔹 Product Management
- List only seller’s own products
- Allow:
  - **Edit**: content, quantity, images/videos
  - **Delete**: soft delete preferred
  - **Status View**: Published / Hidden / Out of Stock

---

## 📁 Backend Updates

### 🔹 User Model

### 🔹 Product Model
```js
seller: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
images: [String],
videos: [String]
```

---

### 🔹 Middleware
- `protectSellerRoute` → only for logged-in sellers
- `protectAdminRoute` → only for admins

---

## 🌆 Media Upload + Arrangement

### 🔹 Frontend
- Use React DnD / SortableJS to rearrange media
- Preview thumbnails before upload
- Store media on Cloudinary/S3 → get secure URLs

### 🔹 Backend
- Use Multer for handling multiple files
- Save uploaded media URLs in MongoDB

---

### 🔒 Access Control Summary

| Action                | Allowed Roles      |
|-----------------------|--------------------|
| Promote to Seller     | Admin              |
| Upload Product        | Seller             |
| Edit Product Info     | Seller (own only)  |
| Upload Images/Videos  | Seller (own only)  |
| Rearrange Media       | Seller (own only)  |
| View Orders/Earnings  | Seller (own only)  |

---
```
