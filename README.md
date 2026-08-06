# QuickMart General Store 🛒

A full-stack e-commerce web application built for a general store, featuring separate **Admin** and **Customer** panels with UPI QR code payment system.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (with built-in in-memory fallback for zero-config demo)
- **Authentication**: JWT (JSON Web Tokens)
- **QR Code**: Dynamic UPI QR generation via `qrcode` library

---

## ✨ Features

### Customer Panel
- Browse, search & filter products by category, price, stock
- Product details with ratings & reviews
- Add to cart, wishlist (favorite items)
- Checkout with shipping address
- **UPI QR Payment** – scan with GPay/PhonePe/Paytm/BHIM
- Submit payment UTR ID + screenshot for verification
- Order history with real-time tracking timeline (Pending → Confirmed → Shipped → Delivered)

### Admin Panel
- Secure admin login
- Dashboard with sales analytics, low stock alerts
- Add / Edit / Delete products (with image upload)
- View & verify customer payment screenshots
- Approve / reject payments and update order status
- Configure UPI ID, merchant name, custom QR image, delivery settings

---

## 🏃 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Configure environment variables

Create a `.env.local` file:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickmart
JWT_SECRET=your_secret_key_here
```

> Without `MONGODB_URI`, the app runs using a built-in in-memory data store with pre-seeded sample products, orders and reviews.

### 3. Run the development server

```bash
node node_modules/next/dist/bin/next dev
# OR if npm scripts work on your system:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@quickmart.com` | `admin123` |
| Customer | `rahul@gmail.com` | `password123` |

Quick-fill buttons are available on the login page.

---

## 💳 UPI QR Payment Flow

1. Customer places order at checkout
2. Dynamic QR code generated with exact payable amount
3. Customer scans with any UPI app & pays
4. Customer submits UTR + optional payment screenshot
5. Admin verifies in Admin Panel and approves
6. Order confirmed for delivery

---

## 📁 Project Structure

```
├── app/
│   ├── api/              # Backend API routes
│   ├── admin/            # Admin panel pages
│   ├── products/         # Product listing & detail
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout form
│   ├── payment/          # UPI QR payment page
│   ├── orders/           # Order history & tracking
│   └── wishlist/         # Saved favorites
├── components/           # Reusable UI components
├── context/              # React Context (auth, cart, wishlist, toasts)
└── lib/                  # Types, DB layer, auth helpers, seed data
```

---

## 🌐 Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect GitHub repo and set env vars
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

---

## 📄 License

MIT
