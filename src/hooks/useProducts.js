import { useState, useEffect } from 'react';

const CUSTOM_PRODUCTS = [
  {
    id: 105,
    title: "Glassmorphic Sand Evening Gown",
    price: 2100.00,
    description: "A dramatic evening gown crafted from sand-toned organza with glassmorphic shimmer, an asymmetrical draped shoulder line, and an elegant sweeping train.",
    category: "women's clothing",
    subcategory: "Western",
    image: "/western_gown.png",
    rating: { rate: 4.7, count: 41 }
  },
  {
    id: 106,
    title: "Alabaster Cashmere Blazer Coat",
    price: 1650.00,
    description: "Tailored from double-faced pure white cashmere, featuring an architectural silhouette, silk lapels, and minimalist hand-stitch finishing.",
    category: "women's clothing",
    subcategory: "Western",
    image: "/western_blazer.png",
    rating: { rate: 4.8, count: 29 }
  }
];

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        const data = await res.json();
        
        // Dynamically assign "Casual" subcategory to standard men's and women's products
        const mappedData = data.map(product => {
          if (product.category === "women's clothing") {
            return { ...product, subcategory: "Casual" };
          }
          if (product.category === "men's clothing") {
            return { ...product, subcategory: "Casual" };
          }
          return product;
        });

        if (isMounted) {
          setProducts([...CUSTOM_PRODUCTS, ...mappedData]);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong while fetching products.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

