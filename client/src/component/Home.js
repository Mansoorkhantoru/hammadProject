import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from './nav';
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Home({ addToCart, cart, setCart, removeFromCart }) {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3000/allproduct");
      setAllProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = allProducts.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <div className="hero-buttons">
            <button className="hero-btn primary" onClick={() => {
              document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Shop Now
            </button>
            <button 
              className="hero-btn secondary" 
              onClick={() => navigate('/trackorder')}
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      <div className="main-body">
        <div className="search-inp">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="🔍 Search products..."
            aria-label="Search products"
          />
        </div>
        
        <div className="products">
          {loading ? (
            <div className="loading-spinner">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : allProducts.length === 0 ? (
            <p>No products available</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found matching "{search}"</p>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={product._id || index}
                className="product"
                onClick={() => navigate(`/product/${product._id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') navigate(`/product/${product._id}`);
                }}
              >
                {/* Image Container with Prescription Badge */}
                <div className="product-image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      e.target.onerror = null;
                    }}
                  />
                  {product.requiresPrescription && (
                    <div className="prescription-badge-top">
                      <span className="prescription-icon">📋</span>
                      <span className="prescription-text">Rx Required</span>
                    </div>
                  )}
                </div>
                
                <h1>{product.name}</h1>
                <div className="product-price">
                  <p>
                    Price <br />
                    <span>
                      Rs: <span className="discount-price">{product.price} </span>
                      {product.discountPrice && (
                        <span > Rs: {product.discountPrice}</span>
                      )}
                    </span>
                  </p>
                </div>
                
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Add to Cart 🛒
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}