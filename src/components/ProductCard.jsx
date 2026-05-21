import React, { memo } from 'react';

const ProductCard = memo(({ product, onAdd, isInCart, quantityInCart, onClickDetails }) => {
  // Console.log inside ProductCard to verify React.memo prevents re-renders when cart changes
  console.log(`[ProductCard Rendered] ID: ${product.id} - ${product.title}`);

  const { title, price, category, image, rating } = product;

  return (
    <div className={`product-card ${isInCart ? 'in-cart' : ''}`} id={`product-${product.id}`}>
      {/* Clickable Image area opens details */}
      <div className="product-image-container" onClick={() => onClickDetails(product)}>
        <img src={image} alt={title} className="product-image" loading="lazy" />
        <span className="product-category">{category}</span>
        {isInCart && (
          <div className="product-badge">
            {quantityInCart} Acquired
          </div>
        )}
      </div>

      <div className="product-info">
        <span className="product-brand">AETHER CURATOR SELECTION</span>
        {/* Clickable Title area opens details */}
        <h3 className="product-title" title={title} onClick={() => onClickDetails(product)}>
          {title}
        </h3>
        
        <div className="product-rating-container" onClick={() => onClickDetails(product)}>
          <div className="stars">
            {Array.from({ length: 5 }, (_, index) => (
              <svg
                key={index}
                className={`star-icon ${index < Math.round(rating?.rate || 0) ? 'active' : ''}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="rating-count">({rating?.count || 0})</span>
        </div>

        <div className="product-footer">
          <div className="product-price-block">
            <span className="price-label">EST. VALUE</span>
            <span className="product-price">${price.toFixed(2)}</span>
          </div>
          <button 
            className={`add-to-cart-btn ${isInCart ? 'btn-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // prevent modal opening
              onAdd(product);
            }}
            aria-label={`Add ${title} to cart`}
          >
            {isInCart ? (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Acquired
              </>
            ) : (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/>
                </svg>
                Acquire
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
