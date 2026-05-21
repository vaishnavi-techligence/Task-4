import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetailsModal';
import AtelierGiftPlanner from './AtelierGiftPlanner';

export default function ProductGrid() {
  const { products, loading, error } = useProducts();
  const { items, addItem, updateQuantity, cartTotal } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Reset subcategory on category changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all');
  };

  // Compute categories from products dynamically
  const categories = useMemo(() => {
    if (!products.length) return [];
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Compute subcategories dynamically based on selectedCategory
  const subcategories = useMemo(() => {
    if (!['women\'s clothing', 'men\'s clothing'].includes(selectedCategory)) return [];
    const subs = new Set(
      products
        .filter(p => p.category === selectedCategory && p.subcategory)
        .map(p => p.subcategory)
    );
    return ['all', ...Array.from(subs)];
  }, [products, selectedCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
      
      // Subcategory filter (if applicable)
      if (selectedSubcategory !== 'all') {
        result = result.filter(p => p.subcategory === selectedSubcategory);
      }
    }

    // Sort order
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, sortBy]);

  // Map of item quantity in cart for constant-time lookups
  const cartQuantityMap = useMemo(() => {
    const map = {};
    items.forEach(item => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [items]);

  // Calculate free shipping progress ($75 target)
  const shippingTarget = 75;
  const progressPercent = Math.min((cartTotal / shippingTarget) * 100, 100);
  const remainingForShipping = Math.max(shippingTarget - cartTotal, 0);

  // Smooth scroll helper for button
  const handleScrollToGrid = () => {
    const el = document.getElementById('products-gallery-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p className="error-message">Oops! {error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>Retry Connection</button>
      </div>
    );
  }

  // Get active product quantity in cart for detail modal
  const detailsQuantity = selectedProductDetails ? (cartQuantityMap[selectedProductDetails.id] || 0) : 0;

  return (
    <div className="browse-section">
      
      {/* ========================================================
          TOP HERO AREA: AETHER EDITORIAL MARQUEE HERO BANNER
         ======================================================== */}
      <section className="editorial-hero-banner">
        {/* Spinning Luxury Curator Seal */}
        <div className="curator-seal-badge">
          <svg className="seal-text-svg" viewBox="0 0 100 100">
            <path id="seal-path" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
            <text className="seal-text">
              <textPath href="#seal-path" startOffset="0%">
                • CERTIFIED VAULT INTEGRITY • AETHER CURATOR SELECTION
              </textPath>
            </text>
          </svg>
          <span className="seal-monogram">A</span>
        </div>

        <div className="hero-left-panel">
          <span className="hero-overline">ATELIER AUTUMN/WINTER VAULT RELEASE</span>
          <h2 className="hero-title">
            Curation of the <span className="hero-title-accent">Avant-Garde</span>
          </h2>
          <p className="hero-description">
            A meticulous collection of hand-selected elements, compiled for those who appreciate design integrity, materials poise, and luxurious aesthetic execution.
          </p>
          <button className="hero-action-btn" onClick={handleScrollToGrid} id="explore-collection-hero">
            <span>Explore Collection</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hero-btn-arrow">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        </div>
        
        <div className="hero-right-panel">
          <div className="hero-collage">
            {/* Card 1: Jewelry Ring */}
            <div className="collage-card card-top pulse-float-1">
              <div className="collage-img-wrapper">
                <img 
                  src="/gold_ring.png" 
                  alt="Gold Petite Ring" 
                  className="collage-img" 
                />
              </div>
              <div className="collage-card-content">
                <span className="collage-category">JEWELRY</span>
                <span className="collage-title" title="Solid Gold Petite Micropave">Solid Gold Ring</span>
                <span className="collage-value">$180.00</span>
              </div>
            </div>

            {/* Card 2: Dragon Bracelet */}
            <div className="collage-card card-middle pulse-float-3">
              <div className="collage-img-wrapper">
                <img 
                  src="/dragon_bracelet.png" 
                  alt="Gold Bracelet" 
                  className="collage-img" 
                />
              </div>
              <div className="collage-card-content">
                <span className="collage-category">JEWELRY</span>
                <span className="collage-title" title="Legends Naga Gold Bracelet">Dragon Bracelet</span>
                <span className="collage-value">$695.00</span>
              </div>
            </div>

            {/* Card 3: Cotton Jacket */}
            <div className="collage-card card-bottom pulse-float-2">
              <div className="collage-img-wrapper">
                <img 
                  src="/cotton_jacket.png" 
                  alt="Cotton Jacket" 
                  className="collage-img" 
                />
              </div>
              <div className="collage-card-content">
                <span className="collage-category">OUTERWEAR</span>
                <span className="collage-title" title="Mens Cotton Jacket">Cotton Jacket</span>
                <span className="collage-value">$55.99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anchor for scroll navigation */}
      <div id="products-gallery-anchor" style={{ scrollMarginTop: '120px' }}></div>

      {/* ========================================================
          THREE-COLUMN RESPONSIVE LAYOUT
         ======================================================== */}
      <div className="shop-layout">
        
        {/* LEFT COLUMN: THE CURATOR'S PANEL */}
        <aside className="shop-sidebar-left">
          <div className="panel-card">
            <h3 className="panel-title">Curation Center</h3>
            
            {/* Search */}
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                id="search-products"
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>

            {/* Category Select */}
            <div className="select-group">
              <label htmlFor="category-filter">Category Select</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="custom-select"
                id="category-filter"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter Pills */}
            {['women\'s clothing', 'men\'s clothing'].includes(selectedCategory) && subcategories.length > 1 && (
              <div className="subcategory-filter-group animate-fade-in">
                <span className="subcategory-filter-label">Atelier Style Curation</span>
                <div className="subcategory-pills">
                  {subcategories.map(sub => (
                    <button
                      key={sub}
                      className={`sub-pill-btn ${selectedSubcategory === sub ? 'active' : ''}`}
                      onClick={() => setSelectedSubcategory(sub)}
                      type="button"
                    >
                      {sub === 'all' ? 'All Pieces' : sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Select */}
            <div className="select-group">
              <label htmlFor="sort-products">Sort Order</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="custom-select"
                id="sort-products"
              >
                <option value="default">Default Catalog</option>
                <option value="price-low-high">Value: Low to High</option>
                <option value="price-high-low">Value: High to Low</option>
                <option value="rating">Collector Rating</option>
              </select>
            </div>
          </div>

          {/* Complimentary Shipping Progress Tracker */}
          <div className="panel-card shipping-tracker-card">
            <h4 className="tracker-title">Atelier Dispatch</h4>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            {remainingForShipping > 0 ? (
              <p className="tracker-text">
                Add <strong>${remainingForShipping.toFixed(2)}</strong> more to unlock complimentary white-glove signature courier dispatch.
              </p>
            ) : (
              <p className="tracker-text success">
                ✨ Your curation qualifies for complimentary signature shipping!
              </p>
            )}
          </div>

          {/* Curation statistics */}
          <div className="panel-card stats-card">
            <h4 className="tracker-title">Live Curation Stats</h4>
            <div className="stat-entry">
              <span className="stat-label">Active Collectors</span>
              <span className="stat-badge">247 Online</span>
            </div>
            <div className="stat-entry">
              <span className="stat-label">Vault Integrity</span>
              <span className="stat-badge">100% Certified</span>
            </div>
            <div className="stat-entry">
              <span className="stat-label">Curator Desk</span>
              <span className="stat-val">Aether, Sector 4</span>
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: THE PRODUCT GALLERY (Main Grid) */}
        <section className="shop-main-gallery">
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="product-card skeleton-card">
                  <div className="skeleton-image pulse"></div>
                  <div className="skeleton-info">
                    <div className="skeleton-title pulse"></div>
                    <div className="skeleton-rating pulse"></div>
                    <div className="skeleton-text pulse"></div>
                    <div className="skeleton-footer">
                      <div className="skeleton-price pulse"></div>
                      <div className="skeleton-btn pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <svg className="no-results-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <h3>No assets found</h3>
              <p>Your search criteria did not match any items in our active vaults.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => {
                const quantity = cartQuantityMap[product.id] || 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addItem}
                    isInCart={quantity > 0}
                    quantityInCart={quantity}
                    onClickDetails={setSelectedProductDetails}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: THE AETHER ATELIER (Gift Casket Planner & Ethos) */}
        <aside className="shop-sidebar-right">
          {/* Custom Dynamic Atelier Gift Planner Component */}
          <AtelierGiftPlanner />

          {/* Curation Ethos */}
          <div className="panel-card atelier-ethos-card">
            <h4 className="tracker-title">Curation Philosophy</h4>
            <p className="ethos-quote">
              "We do not select products; we acquire timeless statements. Each piece is hand-authenticated and cataloged by Aether Atelier experts."
            </p>
            <div className="ethos-divider"></div>
            <p className="ethos-author">— Aether Curation Committee</p>
          </div>

          {/* Promotional Offer Box */}
          <div className="panel-card promo-offer-card">
            <div className="promo-badge-gold">ATELIER MEMBER EXCLUSIVE</div>
            <h4 className="promo-title">Collector Welcome</h4>
            <p className="promo-text">
              Complete your first curation order and receive custom Aether signature linen storage wraps for your collection.
            </p>
          </div>
        </aside>

      </div>

      {/* PRODUCT DETAILS MODAL WINDOW */}
      {selectedProductDetails && (
        <ProductDetailsModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onAdd={addItem}
          isInCart={detailsQuantity > 0}
          quantityInCart={detailsQuantity}
          updateQuantity={updateQuantity}
        />
      )}
    </div>
  );
}
