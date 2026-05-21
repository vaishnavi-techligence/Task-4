import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function AtelierGiftPlanner() {
  const { items } = useCart();
  const [ribbonColor, setRibbonColor] = useState('gold'); // 'gold', 'sage', 'onyx'
  const [giftMessage, setGiftMessage] = useState('To someone special, curated with love.');
  const [selectedFont, setSelectedFont] = useState('alex-brush'); // 'alex-brush', 'great-vibes', 'pinyon-script', 'cormorant'
  const [isSealed, setIsSealed] = useState(false);
  const [packedItems, setPackedItems] = useState({});

  // Reset sealed state if items change or message is cleared
  useEffect(() => {
    // Automatically check new items in packed state
    const newPacked = {};
    items.forEach(item => {
      newPacked[item.id] = packedItems[item.id] !== undefined ? packedItems[item.id] : true;
    });
    setPackedItems(newPacked);
  }, [items]);

  const toggleItemPack = (id) => {
    if (isSealed) return; // lock modifications if sealed
    setPackedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSealCasket = () => {
    if (isSealed) {
      // Unseal to edit
      setIsSealed(false);
    } else {
      // Play seal animation
      setIsSealed(true);
    }
  };

  const getRibbonHex = () => {
    if (ribbonColor === 'sage') return '#3d5e49';
    if (ribbonColor === 'onyx') return '#1d1b18';
    return '#b59a6d'; // gold
  };

  const getFontFamilyStyle = (fontKey) => {
    switch (fontKey) {
      case 'alex-brush': return "'Alex Brush', cursive";
      case 'great-vibes': return "'Great Vibes', cursive";
      case 'pinyon-script': return "'Pinyon Script', cursive";
      case 'cormorant': return "'Cormorant Garamond', serif";
      default: return "'Alex Brush', cursive";
    }
  };

  const packedCount = Object.values(packedItems).filter(Boolean).length;

  return (
    <div className="panel-card gift-planner-card" id="gift-box-planner">
      <h3 className="panel-title">Atelier Gift Casket</h3>
      
      {/* 1. INTERACTIVE BOX PREVIEW */}
      <div className="gift-box-wrapper">
        <div className={`casket-box ${isSealed ? 'sealed-box' : ''}`}>
          {/* Box Lid */}
          <div className="casket-lid"></div>
          {/* Silk Ribbons (Cross) */}
          <div className="casket-ribbon-v" style={{ backgroundColor: getRibbonHex() }}></div>
          <div className="casket-ribbon-h" style={{ backgroundColor: getRibbonHex() }}></div>
          {/* Beautiful Bow */}
          <div className="casket-bow" style={{ borderColor: getRibbonHex() }}>
            <div className="bow-loop-l" style={{ borderColor: getRibbonHex() }}></div>
            <div className="bow-loop-r" style={{ borderColor: getRibbonHex() }}></div>
          </div>
          {/* Box Body */}
          <div className="casket-body"></div>
        </div>
        <p className="gift-casket-badge">
          {isSealed ? '✨ SECURED VAULT BOX' : '🛒 PACKING ATELIER'}
        </p>
      </div>

      {/* 2. RIBBON SELECTION */}
      <div className="gift-section">
        <span className="gift-section-label">Select Silk Ribbon</span>
        <div className="ribbon-swatches">
          <button 
            className={`swatch-btn gold-swatch ${ribbonColor === 'gold' ? 'active' : ''}`}
            onClick={() => !isSealed && setRibbonColor('gold')}
            aria-label="Champagne Gold Ribbon"
            disabled={isSealed}
          >
            <span className="swatch-color"></span>
          </button>
          <button 
            className={`swatch-btn sage-swatch ${ribbonColor === 'sage' ? 'active' : ''}`}
            onClick={() => !isSealed && setRibbonColor('sage')}
            aria-label="Forest Sage Ribbon"
            disabled={isSealed}
          >
            <span className="swatch-color"></span>
          </button>
          <button 
            className={`swatch-btn onyx-swatch ${ribbonColor === 'onyx' ? 'active' : ''}`}
            onClick={() => !isSealed && setRibbonColor('onyx')}
            aria-label="Onyx Black Ribbon"
            disabled={isSealed}
          >
            <span className="swatch-color"></span>
          </button>
        </div>
      </div>

      {/* 3. ITEM PACKING CHECKBOXES */}
      <div className="gift-section">
        <span className="gift-section-label">Pack Items in Casket ({packedCount})</span>
        {items.length === 0 ? (
          <p className="gift-empty-notice">Your cart is empty. Acquire products to pack them in your signature casket.</p>
        ) : (
          <div className="gift-packing-list">
            {items.map(item => (
              <label 
                key={item.id} 
                className={`pack-item-row ${packedItems[item.id] ? 'checked' : ''} ${isSealed ? 'disabled' : ''}`}
              >
                <input 
                  type="checkbox" 
                  checked={!!packedItems[item.id]} 
                  onChange={() => toggleItemPack(item.id)}
                  disabled={isSealed}
                  className="pack-checkbox"
                />
                <span className="pack-item-title" title={item.title}>{item.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. CALLIGRAPHY STATION */}
      <div className="gift-section">
        <span className="gift-section-label">Write Signature Gift Card</span>
        <textarea
          className="gift-card-input"
          value={giftMessage}
          onChange={(e) => setGiftMessage(e.target.value)}
          placeholder="Type your curated message here..."
          maxLength="90"
          disabled={isSealed}
          aria-label="Calligraphy Card Note"
        />

        {/* Dynamic Signature Font Selector */}
        <div className="font-selector-row">
          <span className="font-selector-label">Signature Script Style</span>
          <div className="font-options">
            <button 
              className={`font-opt-btn ${selectedFont === 'alex-brush' ? 'active' : ''}`}
              onClick={() => !isSealed && setSelectedFont('alex-brush')}
              style={{ fontFamily: "'Alex Brush', cursive" }}
              disabled={isSealed}
              type="button"
            >
              Alex Brush
            </button>
            <button 
              className={`font-opt-btn ${selectedFont === 'great-vibes' ? 'active' : ''}`}
              onClick={() => !isSealed && setSelectedFont('great-vibes')}
              style={{ fontFamily: "'Great Vibes', cursive" }}
              disabled={isSealed}
              type="button"
            >
              Great Vibes
            </button>
            <button 
              className={`font-opt-btn ${selectedFont === 'pinyon-script' ? 'active' : ''}`}
              onClick={() => !isSealed && setSelectedFont('pinyon-script')}
              style={{ fontFamily: "'Pinyon Script', cursive" }}
              disabled={isSealed}
              type="button"
            >
              Pinyon Script
            </button>
            <button 
              className={`font-opt-btn ${selectedFont === 'cormorant' ? 'active' : ''}`}
              onClick={() => !isSealed && setSelectedFont('cormorant')}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
              disabled={isSealed}
              type="button"
            >
              Serif
            </button>
          </div>
        </div>
        
        {/* Real-time Calligraphy Card Preview */}
        <div className="calligraphy-card-container">
          <div className="calligraphy-card">
            <span className="card-header-monogram">A</span>
            <p 
              className="card-message"
              style={{ 
                fontFamily: getFontFamilyStyle(selectedFont), 
                fontStyle: selectedFont === 'cormorant' ? 'italic' : 'normal' 
              }}
            >
              {giftMessage || 'Write your signature message...'}
            </p>
            <span className="card-footer-brand">AETHER ATELIER</span>

            {/* GOLD MONOGRAM WAX SEAL ANIMATED STAMP */}
            {isSealed && (
              <div className="wax-seal-wrapper">
                <div className="wax-seal-stamp">
                  <span className="wax-seal-letter">A</span>
                </div>
                <div className="wax-seal-glow-ring"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        className={`seal-casket-btn ${isSealed ? 'btn-sealed' : ''}`}
        onClick={handleSealCasket}
        id="seal-gift-casket"
      >
        {isSealed ? (
          <>
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
              <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm6 17H6V10h12v10z"/>
            </svg>
            Unlock to Edit Package
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
            Seal Casket & Card
          </>
        )}
      </button>
    </div>
  );
}
