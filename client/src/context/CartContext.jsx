import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('agriconnect_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return { success: false, message: 'Invalid quantity' };

    let added = false;
    let errorMsg = null;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > product.quantity) {
          errorMsg = `Cannot exceed available quantity (${product.quantity} ${product.unit})`;
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          price_per_unit: product.price_per_unit, // Ensure latest price
        };
        added = true;
        return updated;
      } else {
        if (qty > product.quantity) {
          errorMsg = `Cannot exceed available quantity (${product.quantity} ${product.unit})`;
          return prev;
        }

        added = true;
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            farmer_id: product.farmer_id,
            farmer_name: product.farmer_name,
            price_per_unit: parseFloat(product.price_per_unit),
            unit: product.unit,
            max_quantity: parseFloat(product.quantity),
            image_url: product.image_url,
            location: product.location,
            quantity: qty,
          },
        ];
      }
    });

    if (errorMsg) return { success: false, message: errorMsg };
    return { success: true, message: `Added ${product.name} to cart` };
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseFloat(newQuantity);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const finalQty = Math.min(qty, item.max_quantity);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price_per_unit * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 50.0 : 0.0;
  const totalAmount = subtotal + deliveryFee;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
