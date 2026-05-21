import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { produce } from '../utils/produce';

const CartContext = createContext(null);

const initialState = {
  items: []
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return produce(state, draft => {
        const existing = draft.items.find(item => item.id === action.payload.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          draft.items.push({ ...action.payload, quantity: 1 });
        }
      });

    case 'REMOVE_ITEM':
      return produce(state, draft => {
        draft.items = draft.items.filter(item => item.id !== action.payload);
      });

    case 'UPDATE_QUANTITY':
      return produce(state, draft => {
        const item = draft.items.find(item => item.id === action.payload.id);
        if (item) {
          if (action.payload.quantity <= 0) {
            draft.items = draft.items.filter(i => i.id !== action.payload.id);
          } else {
            item.quantity = action.payload.quantity;
          }
        }
      });

    case 'CLEAR_CART':
      return produce(state, draft => {
        draft.items = [];
      });

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  const { state, dispatch } = context;

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, [dispatch]);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, [dispatch]);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  const cartTotal = useMemo(() => {
    return parseFloat(
      state.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    );
  }, [state.items]);

  const itemCount = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  return {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount
  };
}
