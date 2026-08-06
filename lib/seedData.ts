import { Product, StoreSettings, User, Review, Order } from './types';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "QuickMart General Store",
  ownerName: "Manoranjan General Merchant",
  phone: "+91 98765 43210",
  email: "admin@quickmart.com",
  address: "Main Market Road, Near Central Clock Tower, City",
  upiId: "quickmart@upi",
  upiName: "QuickMart General Store",
  customQrImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
  lowStockThreshold: 10,
  deliveryFee: 30,
  freeDeliveryMinAmount: 499,
};

export const INITIAL_USERS: User[] = [
  {
    _id: "usr_admin_1",
    name: "Store Admin",
    email: "admin@quickmart.com",
    role: "admin",
    phone: "9876543210",
    address: "QuickMart HQ, Main Market",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "usr_cust_1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "customer",
    phone: "9812345678",
    address: "Flat 402, Sunshine Apartments, Civil Lines",
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    _id: "prod_1",
    name: "Fortune Sunlite Refined Sunflower Oil (5L Jar)",
    category: "Grocery & Staples",
    price: 780,
    discount: 12,
    description: "High quality light and healthy cooking oil rich in Vitamin E. Ideal for everyday cooking, deep frying, and sautéeing.",
    stock: 25,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    numReviews: 24,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_2",
    name: "Aashirvaad Shudh Chakki Atta (10kg Pack)",
    category: "Grocery & Staples",
    price: 460,
    discount: 8,
    description: "100% pure whole wheat flour processed with mechanical chakki process. Makes ultra soft, rotis loaded with natural fibre.",
    stock: 18,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    numReviews: 45,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_3",
    name: "Amul Butter - Pasteurised (500g Pack)",
    category: "Dairy & Bakery",
    price: 275,
    discount: 5,
    description: "Utterly butterly delicious Amul Butter made from pure cow and buffalo milk fats. Essential for morning toast and baking.",
    stock: 30,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    numReviews: 62,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_4",
    name: "Tata Tea Gold Rich & Aromatic Blend (500g)",
    category: "Beverages",
    price: 330,
    discount: 10,
    description: "Premium black tea blended with long leaf tea leaves. Delivers rich aroma and full-bodied taste in every sip.",
    stock: 14,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
    rating: 4.7,
    numReviews: 19,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_5",
    name: "Cadbury Dairy Milk Silk Chocolate (150g)",
    category: "Snacks & Sweets",
    price: 180,
    discount: 15,
    description: "Smooth, creamy and silky chocolate that melts in your mouth. Perfect sweet treat for all celebrations.",
    stock: 45,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    numReviews: 88,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_6",
    name: "Surf Excel Easy Wash Detergent Powder (1kg)",
    category: "Household & Cleaning",
    price: 140,
    discount: 10,
    description: "Removes tough stains in just 1 stroke. Superior cleaning action that leaves clothes smelling fresh.",
    stock: 4, // Low stock demo!
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=80",
    rating: 4.6,
    numReviews: 15,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_7",
    name: "Dettol Antiseptic Liquid Disinfectant (500ml)",
    category: "Personal Care",
    price: 215,
    discount: 6,
    description: "Trusted germ protection for first aid, personal hygiene and household disinfection. Dermatologically tested.",
    stock: 5, // Low stock demo!
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    numReviews: 33,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_8",
    name: "Nescafe Classic Instant Coffee Powder (100g Glass Jar)",
    category: "Beverages",
    price: 360,
    discount: 12,
    description: "100% pure natural coffee beans roasted to perfection. Delivers bold coffee flavor to kickstart your day.",
    stock: 20,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    numReviews: 41,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    _id: "rev_1",
    productId: "prod_1",
    userId: "usr_cust_1",
    userName: "Rahul Sharma",
    rating: 5,
    comment: "Excellent quality oil. Fast delivery from QuickMart store! Will order again.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "rev_2",
    productId: "prod_3",
    userId: "usr_cust_1",
    userName: "Priya Patel",
    rating: 5,
    comment: "Fresh pack of Amul butter delivered cold. Very happy with the service.",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    _id: "ORD-98241",
    userId: "usr_cust_1",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    items: [
      {
        productId: "prod_1",
        name: "Fortune Sunlite Refined Sunflower Oil (5L Jar)",
        price: 780,
        discountPrice: 686.4,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80"
      },
      {
        productId: "prod_5",
        name: "Cadbury Dairy Milk Silk Chocolate (150g)",
        price: 180,
        discountPrice: 153,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Rahul Sharma",
      phone: "9812345678",
      street: "Flat 402, Sunshine Apartments, Civil Lines",
      city: "City Center",
      state: "State",
      pincode: "110001",
      notes: "Leave with security guard if not home"
    },
    subtotal: 1140,
    discountSavings: 147.6,
    deliveryFee: 0,
    totalAmount: 992.4,
    paymentMethod: "UPI_QR",
    paymentStatus: "Paid",
    paymentDetails: {
      upiTransactionId: "UPI98237192837",
      screenshotUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80",
      paidAt: new Date(Date.now() - 86400000).toISOString(),
      verifiedAt: new Date(Date.now() - 80000000).toISOString(),
    },
    orderStatus: "Confirmed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];
