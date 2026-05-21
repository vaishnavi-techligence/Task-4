import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutSummary from './components/CheckoutSummary';

function MainApp() {
  const { itemCount } = useCart();
  const [currentView, setCurrentView] = useState('browse'); // 'browse' or 'checkout'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="premium-header">
        <div className="header-content">
          <div className="logo-section" onClick={() => setCurrentView('browse')}>
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h1 className="logo-text">AETHER.</h1>
          </div>

          <nav className="nav-actions">
            <span 
              className={`nav-link ${currentView === 'browse' ? 'active' : ''}`}
              onClick={() => setCurrentView('browse')}
            >
              Browse Shop
            </span>
            <span 
              className={`nav-link ${currentView === 'checkout' ? 'active' : ''}`}
              onClick={() => setCurrentView('checkout')}
            >
              Checkout
            </span>

            <button 
              className="cart-trigger-btn"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open cart drawer"
              id="open-cart-drawer"
            >
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'browse' ? (
          <ProductGrid />
        ) : (
          <CheckoutSummary onBackToBrowse={() => setCurrentView('browse')} />
        )}
      </main>

      {/* Cart Drawer sliding from right */}
      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        onCheckout={() => setCurrentView('checkout')}
      />

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            </svg>
            <span className="footer-logo-text">AETHER STORE</span>
          </div>
          <div className="footer-tech">
            <span className="tech-badge">Fake Store API</span>
            <span className="tech-badge">Context + useReducer</span>
            <span className="tech-badge">Vanilla CSS Glassmorphism</span>
            <span className="tech-badge">Custom produce()</span>
          </div>
          <span className="footer-copy">© 2026 Aether Inc. Premium Experience.</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
