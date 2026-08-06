'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem, Product } from '@/lib/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  cart: CartItem[];
  wishlist: string[];
  toasts: Toast[];
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load user profile & persistent cart/wishlist
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          loadWishlist();
        }
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setLoading(false);
      }
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('quickmart_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }

    loadUser();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (data.wishlistProductIds) {
        setWishlist(data.wishlistProductIds);
      }
    } catch (e) {}
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (userData: User, token: string) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
    loadWishlist();
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setWishlist([]);
      showToast('Logged out successfully', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('quickmart_cart', JSON.stringify(updatedCart));
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Item is currently out of stock', 'error');
      return;
    }

    const existingIndex = cart.findIndex(ci => ci.product._id === product._id);
    let updated: CartItem[];

    if (existingIndex >= 0) {
      const currentQty = cart[existingIndex].quantity;
      const newQty = Math.min(currentQty + quantity, product.stock);
      updated = [...cart];
      updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
    } else {
      updated = [...cart, { product, quantity: Math.min(quantity, product.stock) }];
    }

    saveCartToStorage(updated);
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter(ci => ci.product._id !== productId);
    saveCartToStorage(updated);
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map(ci => {
      if (ci.product._id === productId) {
        return { ...ci, quantity: Math.min(quantity, ci.product.stock) };
      }
      return ci;
    });
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      showToast('Please log in to add items to wishlist', 'error');
      return;
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        setWishlist(data.wishlistProductIds);
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Failed to update wishlist', 'error');
      }
    } catch (e) {
      showToast('Error updating wishlist', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        cart,
        wishlist,
        toasts,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        showToast,
        removeToast,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-rose-100 border-rose-700/50 backdrop-blur-md'
                : 'bg-slate-900/90 text-slate-100 border-slate-700/50 backdrop-blur-md'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-xs opacity-70 hover:opacity-100 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
