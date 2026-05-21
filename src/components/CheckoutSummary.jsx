import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutSummary({ onBackToBrowse }) {
  const { items, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Calculate pricing values
  const shippingFee = cartTotal > 75 ? 0 : 5.99;
  const estimatedTax = parseFloat((cartTotal * 0.0825).toFixed(2));
  const finalTotal = parseFloat((cartTotal + shippingFee + estimatedTax).toFixed(2));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // In a real app we'd post to API
    setOrderPlaced(true);
  };

  const handleFinishOrder = () => {
    clearCart();
    onBackToBrowse();
  };

  if (orderPlaced) {
    return (
      <div className="order-success-screen">
        <div className="success-card">
          <div className="success-checkmark-circle">
            <svg className="success-checkmark" viewBox="0 0 52 52">
              <circle className="success-checkmark-circle-svg" cx="26" cy="26" r="25" fill="none" />
              <path className="success-checkmark-check-svg" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <h2>Thank You For Your Order!</h2>
          <p className="order-id">Order ID: #FSA-{Math.floor(100000 + Math.random() * 900000)}</p>
          <p className="success-message">
            Your payment was processed successfully. A confirmation email has been sent to <strong>{formData.email || 'customer@example.com'}</strong>.
          </p>

          <div className="receipt-summary">
            <h3>Receipt Summary</h3>
            <div className="receipt-items">
              {items.map(item => (
                <div key={item.id} className="receipt-item">
                  <span>{item.title} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="receipt-divider"></div>
            <div className="receipt-row">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="receipt-row">
              <span>Shipping:</span>
              <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="receipt-row">
              <span>Estimated Tax (8.25%):</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="receipt-row receipt-total">
              <span>Total Paid:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button className="back-home-btn" onClick={handleFinishOrder}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty-container">
        <svg className="empty-checkout-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 13.7c-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1c-.1-.6-.6-1.1-1.1-1.1zm-7 0c-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1s1.1-.5 1.1-1.1c0-.6-.5-1.1-1.1-1.1zm13.5-8h-3.3c-.7-2.6-3-4.5-5.7-4.5S8.5 3.1 7.8 5.7H4.5c-1.4 0-2.5 1.1-2.5 2.5v11c0 1.4 1.1 2.5 2.5 2.5h15c1.4 0 2.5-1.1 2.5-2.5v-11c0-1.4-1.1-2.5-2.5-2.5zm-8-2.5c1.5 0 2.7 1.1 3.1 2.5H8.9c.4-1.4 1.6-2.5 3.1-2.5zm8 16c0 .3-.2.5-.5.5h-15c-.3 0-.5-.2-.5-.5v-11c0-.3.2-.5.5-.5h15c.3 0 .5.2.5.5v11z"/>
        </svg>
        <h2>Your Cart is Empty</h2>
        <p>You cannot checkout with an empty cart. Add items to checkout.</p>
        <button className="back-browse-btn" onClick={onBackToBrowse}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-back-link" onClick={onBackToBrowse}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Products
      </div>

      <h1 className="checkout-title">Secure Checkout</h1>

      <div className="checkout-layout">
        {/* Forms column */}
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-section">
            <h3>1. Shipping Information</h3>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  required 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  required 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="input-group">
              <label htmlFor="address">Delivery Address</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                required 
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Neon Highway, Sector 4"
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  required 
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Neo City"
                />
              </div>
              <div className="input-group">
                <label htmlFor="zipCode">Zip/Postal Code</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  name="zipCode" 
                  required 
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="94016"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>2. Payment Method</h3>
            <div className="payment-type-selector">
              <div className="payment-type active">
                <input type="radio" id="creditCard" name="paymentType" defaultChecked />
                <label htmlFor="creditCard" className="payment-label">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="payment-card-icon">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <span>Credit / Debit Card</span>
                </label>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input 
                type="text" 
                id="cardNumber" 
                name="cardNumber" 
                required 
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="4111 2222 3333 4444"
                maxLength="19"
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="expiry">Expiration Date</label>
                <input 
                  type="text" 
                  id="expiry" 
                  name="expiry" 
                  required 
                  value={formData.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="input-group">
                <label htmlFor="cvv">Security Code (CVV)</label>
                <input 
                  type="password" 
                  id="cvv" 
                  name="cvv" 
                  required 
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="•••"
                  maxLength="4"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-order-btn" id="submit-checkout-form">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            Complete Purchase (${finalTotal.toFixed(2)})
          </button>
        </form>

        {/* Sidebar Summary column */}
        <div className="checkout-summary-sidebar">
          <div className="sticky-summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-items-list">
              {items.map(item => (
                <div key={item.id} className="summary-item-row">
                  <div className="summary-item-left">
                    <img src={item.image} alt={item.title} className="summary-item-image" />
                    <div className="summary-item-desc">
                      <h4 className="summary-item-title" title={item.title}>{item.title}</h4>
                      <span className="summary-item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-pricing-breakdown">
              <div className="pricing-row">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="pricing-row">
                <span>Shipping:</span>
                <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="pricing-row">
                <span>Estimated Tax (8.25%):</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="pricing-divider"></div>
              <div className="pricing-row total-row">
                <span>Grand Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="guarantee-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
              <span>Secure 256-bit SSL encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
