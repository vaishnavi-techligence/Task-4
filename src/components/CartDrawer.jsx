import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, updateQuantity, removeItem, cartTotal, itemCount } = useCart();

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <aside 
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        id="cart-drawer-container"
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h2>Your Cart</h2>
            <span className="drawer-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button 
            className="close-drawer-btn" 
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="drawer-content">
          {items.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-icon-wrapper">
                <svg className="empty-cart-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.88 1.46h13.08c.88 0 1.65-.62 1.88-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.5L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Add products to get started on your purchase!</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                Start Browsing
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        </button>
                      </div>

                      <button 
                        className="delete-item-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span className="footer-total">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="shipping-note">Taxes and shipping calculated at checkout.</p>
            <button 
              className="checkout-btn"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              id="go-to-checkout"
            >
              <span>Proceed to Checkout</span>
              <svg className="checkout-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
