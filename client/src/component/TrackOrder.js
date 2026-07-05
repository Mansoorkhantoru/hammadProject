import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './nav';
import Footer from './Footer';
import './TrackOrder.css';

export default function TrackOrder({ cart, setCart, removeFromCart }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('phone');
  const [foundOrders, setFoundOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError(`Please enter a ${searchType === 'phone' ? 'phone number' : 'name'}`);
      return;
    }

    setLoading(true);
    setError('');
    setFoundOrders([]);

    try {
      const response = await axios.get('http://localhost:3000/allorders');
      const allOrders = response.data.orders || [];
      
      // Filter orders by phone number or name with proper type checking
      const filtered = allOrders.filter(order => {
        if (searchType === 'phone') {
          // Clean the search value (remove spaces, special characters)
          const searchPhone = searchValue.trim().replace(/\s/g, '');
          
          // Safely get order phone and convert to string
          const orderPhone = order.phone ? String(order.phone).trim().replace(/\s/g, '') : '';
          
          // Check if order phone contains the search phone
          return orderPhone.includes(searchPhone);
        } else {
          // Search by name (case insensitive)
          const searchName = searchValue.trim().toLowerCase();
          
          // Safely get order name and convert to string
          const orderName = order.name ? String(order.name).toLowerCase() : '';
          
          return orderName.includes(searchName);
        }
      });

      if (filtered.length > 0) {
        setFoundOrders(filtered);
        setError('');
      } else {
        setFoundOrders([]);
        setError(`No orders found for this ${searchType === 'phone' ? 'phone number' : 'name'}`);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to track order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': '#f39c12',
      'accepted': '#3498db',
      'preparing': '#9b59b6',
      'on the way': '#2ecc71',
      'delivered': '#27ae60',
      'cancelled': '#e74c3c'
    };
    return statusMap[status?.toLowerCase()] || '#95a5a6';
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'accepted', 'preparing', 'on the way', 'delivered'];
    const index = steps.indexOf(status?.toLowerCase());
    return index === -1 ? 0 : index;
  };

  const getStatusEmoji = (status) => {
    const emojiMap = {
      'pending': '⏳',
      'accepted': '✅',
      'preparing': '👨‍🍳',
      'on the way': '🚚',
      'delivered': '📦',
      'cancelled': '❌'
    };
    return emojiMap[status?.toLowerCase()] || '📋';
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const phoneStr = String(phone);
    // Format as: 03XX-XXXXXXX or similar
    if (phoneStr.length === 11) {
      return `${phoneStr.slice(0, 4)}-${phoneStr.slice(4)}`;
    }
    return phoneStr;
  };

  return (
    <div>
      <Nav cartt={cart} setCart={setCart} removeFromCart={removeFromCart} />
      
      <div className="track-order-container">
        <div className="track-order-header">
          <h1>📦 Track Your Order</h1>
          <p>Enter your phone number or name to track your orders</p>
        </div>

        <form onSubmit={handleTrackOrder} className="track-order-form">
          <div className="search-type-selector">
            <button
              type="button"
              className={`type-btn ${searchType === 'phone' ? 'active' : ''}`}
              onClick={() => {
                setSearchType('phone');
                setError('');
                setFoundOrders([]);
              }}
            >
              📱 Phone Number
            </button>
            <button
              type="button"
              className={`type-btn ${searchType === 'name' ? 'active' : ''}`}
              onClick={() => {
                setSearchType('name');
                setError('');
                setFoundOrders([]);
              }}
            >
              👤 Name
            </button>
          </div>

          <div className="input-group">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === 'phone' ? 'Enter your phone number (e.g., 03XXXXXXXXX)' : 'Enter your name'}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : '🔍 Track Order'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>

        {foundOrders.length > 0 && (
          <div className="orders-list">
            <h2 className="orders-found-title">
              Found {foundOrders.length} order{foundOrders.length > 1 ? 's' : ''}
            </h2>
            
            {foundOrders.map((order, index) => (
              <div key={order._id || index} className="order-card">
                {/* Customer Info - Name and Phone Number Prominently Displayed */}
                <div className="customer-info-section">
                  <h2>👤 Customer Information</h2>
                  <div className="customer-details">
                    <div className="customer-detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{order.name || 'N/A'}</span>
                    </div>
                    <div className="customer-detail-item">
                      <span className="detail-label">Phone Number:</span>
                      <span className="detail-value phone-number">
                        {formatPhoneNumber(order.phone)}
                      </span>
                    </div>
                    <div className="customer-detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{order.email || 'N/A'}</span>
                    </div>
                    <div className="customer-detail-item">
                      <span className="detail-label">Delivery Address:</span>
                      <span className="detail-value">{order.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="order-header">
                  <div className="order-id">
                    <strong>Order ID:</strong> {order._id}
                  </div>
                  <div className="order-date">
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="order-status-section">
                  <h3>📊 Order Status</h3>
                  <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                    {getStatusEmoji(order.status)} {order.status || 'Pending'}
                  </div>
                  
                  <div className="status-progress">
                    {['Pending', 'Accepted', 'Preparing', 'On The Way', 'Delivered'].map((step, stepIndex) => (
                      <div key={step} className="status-step">
                        <div 
                          className={`status-dot ${stepIndex <= getStatusStep(order.status) ? 'active' : ''}`}
                        />
                        <div className="status-label">{step}</div>
                        {stepIndex < 4 && (
                          <div className={`status-line ${stepIndex < getStatusStep(order.status) ? 'active' : ''}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-items">
                  <h3>🛍️ Order Items</h3>
                  {order.items && order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="order-item">
                      <span className="item-name">{item.productName || `Product ${itemIndex + 1}`}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-price">Rs. {item.price}</span>
                    </div>
                  ))}
                </div>

                {order.prescription && (
                  <div className="prescription-section">
                    <h3>📋 Prescription</h3>
                    <a href={order.prescription} target="_blank" rel="noopener noreferrer" className="prescription-link">
                      View Prescription Document
                    </a>
                  </div>
                )}

                {foundOrders.length > 1 && index < foundOrders.length - 1 && (
                  <div className="order-divider"></div>
                )}
              </div>
            ))}

            <div className="order-actions">
              <button 
                className="back-btn"
                onClick={() => navigate('/')}
              >
                ← Back to Shopping
              </button>
            </div>
          </div>
        )}

        <div className="sample-orders">
          <h3>💡 How to Track Your Order</h3>
          <p>1. Enter your phone number or name used when placing the order</p>
          <p>2. Click "Track Order" to see all your orders</p>
          <p>3. Each order will show its current status and progress</p>
          <br />
          <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>
            Need help? Contact us at support@store.com or call +92-XXX-XXXXXXX
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}