export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  discount: number; // percentage, e.g. 10 for 10%
  description: string;
  stock: number;
  image: string;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  discountPrice: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discountSavings: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'UPI_QR';
  paymentStatus: 'Pending Verification' | 'Paid' | 'Rejected';
  paymentDetails?: {
    upiTransactionId?: string;
    screenshotUrl?: string;
    paidAt?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  upiId: string;
  upiName: string;
  customQrImage?: string;
  lowStockThreshold: number;
  deliveryFee: number;
  freeDeliveryMinAmount: number;
}
