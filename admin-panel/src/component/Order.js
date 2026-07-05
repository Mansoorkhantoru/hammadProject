import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./Order.css"
import Sidebar from './sidebar'

export default function Order() {
    const [allOrders, setAllOrders] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        accepted: 0,
        preparing: 0,
        onTheWay: 0,
        delivered: 0,
        cancelled: 0
    })
    const [updating, setUpdating] = useState({})
    
    const fetchData = async() => {
        try {
            const response = await axios.get("http://localhost:3000/allorders");
            const orders = response.data.orders || [];
            setAllOrders(orders);
            calculateStats(orders);
        } catch (error) {
            console.error("Error fetching orders:", error.message)
        }
    }
    
    const calculateStats = (orders) => {
        const total = orders.length;
        const pending = orders.filter(order => order.status === "Pending" || !order.status).length;
        const accepted = orders.filter(order => order.status === "Accepted").length;
        const preparing = orders.filter(order => order.status === "Preparing").length;
        const onTheWay = orders.filter(order => order.status === "On The Way").length;
        const delivered = orders.filter(order => order.status === "Delivered").length;
        const cancelled = orders.filter(order => order.status === "Cancelled").length;
        
        setStats({
            total,
            pending,
            accepted,
            preparing,
            onTheWay,
            delivered,
            cancelled
        });
    }
    
    useEffect(() => {
        fetchData()
    }, [])
    
    const DeleteOrder = async (OrderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        
        try {
            const response = await axios.delete(
                `http://localhost:3000/allorders/${OrderId}`
            )
            if (response.data.success) {
                const updatedOrders = allOrders.filter(order => order._id !== OrderId);
                setAllOrders(updatedOrders);
                calculateStats(updatedOrders);
                alert('Order deleted successfully');
            } else {
                alert("Failed to delete order: " + response.data.message)
            }
        } catch (error) {
            console.error(error.message)
            alert('Failed to delete order');
        }
    }
    
    // Function to update order status to any status
    const updateOrderStatus = async (orderId, newStatus) => {
        setUpdating(prev => ({ ...prev, [orderId]: true }));
        
        try {
            const response = await axios.put(
                `http://localhost:3000/allorders/${orderId}/status`,
                { status: newStatus }
            )
            if (response.data.success) {
                const updatedOrders = allOrders.map(order => 
                    order._id === orderId 
                        ? { ...order, status: newStatus } 
                        : order
                );
                setAllOrders(updatedOrders);
                calculateStats(updatedOrders);
            } else {
                alert("Failed to update order status: " + response.data.message)
            }
        } catch (error) {
            console.error("Error updating status:", error.message)
            alert("Failed to update order status")
        } finally {
            setUpdating(prev => ({ ...prev, [orderId]: false }));
        }
    }
    
    // Function to get status color
    const getStatusColor = (status) => {
        switch(status) {
            case "Pending":
                return "status-pending";
            case "Accepted":
                return "status-accepted";
            case "Preparing":
                return "status-preparing";
            case "On The Way":
                return "status-on-the-way";
            case "Delivered":
                return "status-delivered";
            case "Cancelled":
                return "status-cancelled";
            default:
                return "status-pending";
        }
    }
    
    // Function to get status emoji
    const getStatusEmoji = (status) => {
        const emojiMap = {
            'Pending': '⏳',
            'Accepted': '✅',
            'Preparing': '👨‍🍳',
            'On The Way': '🚚',
            'Delivered': '📦',
            'Cancelled': '❌'
        };
        return emojiMap[status] || '📋';
    }
    
    // Function to check if status is final (Delivered or Cancelled)
    const isFinalStatus = (status) => {
        return status === "Delivered" || status === "Cancelled";
    }
    
    // Function to get status badge color
    const getStatusBadgeColor = (status) => {
        const colorMap = {
            'Pending': '#f39c12',
            'Accepted': '#3498db',
            'Preparing': '#9b59b6',
            'On The Way': '#2ecc71',
            'Delivered': '#27ae60',
            'Cancelled': '#e74c3c'
        };
        return colorMap[status] || '#95a5a6';
    }
    
    // All available statuses for dropdown
    const statusOptions = [
        { value: 'Pending', label: '⏳ Pending' },
        { value: 'Accepted', label: '✅ Accepted' },
        { value: 'Preparing', label: '👨‍🍳 Preparing' },
        { value: 'On The Way', label: '🚚 On The Way' },
        { value: 'Delivered', label: '📦 Delivered' },
        { value: 'Cancelled', label: '❌ Cancelled' }
    ];
    
    return (
        <div className="all">
            <div className="btn">
                <Sidebar />
                <h1>ORDERS</h1>
            </div>
            
            <div className='orders'>
                <h1>ORDERS</h1>
                
                {/* Stats Cards - Updated with all statuses */}
                <div className="stats-container">
                    <div className="stat-card total">
                        <h3>📊 Total Orders</h3>
                        <p className="stat-number">{stats.total}</p>
                    </div>
                    <div className="stat-card pending">
                        <h3>⏳ Pending</h3>
                        <p className="stat-number">{stats.pending}</p>
                    </div>
                    <div className="stat-card accepted">
                        <h3>✅ Accepted</h3>
                        <p className="stat-number">{stats.accepted}</p>
                    </div>
                    <div className="stat-card preparing">
                        <h3>👨‍🍳 Preparing</h3>
                        <p className="stat-number">{stats.preparing}</p>
                    </div>
                    <div className="stat-card on-the-way">
                        <h3>🚚 On The Way</h3>
                        <p className="stat-number">{stats.onTheWay}</p>
                    </div>
                    <div className="stat-card delivered">
                        <h3>📦 Delivered</h3>
                        <p className="stat-number">{stats.delivered}</p>
                    </div>
                    <div className="stat-card cancelled">
                        <h3>❌ Cancelled</h3>
                        <p className="stat-number">{stats.cancelled}</p>
                    </div>
                </div>
                
                {allOrders.length === 0 ? (
                    <p className="no-orders">No orders available</p>
                ) : (
                    allOrders.map((order, index) => (
                        <div 
                            key={index} 
                            className={`order ${getStatusColor(order.status)}`}
                        >
                            <div className="maxorder">
                                {order.prescription && (
                                    <div className="prescription-preview">
                                        <img src={order.prescription} alt="Prescription" />
                                        <a href={order.prescription} target="_blank" rel="noopener noreferrer">
                                            📋 View Prescription
                                        </a>
                                    </div>
                                )}
                                
                                <div className="order-info-grid">
                                    <div className="info-item">
                                        <label>👤 Name</label>
                                        <p>{order.name || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>📍 Address</label>
                                        <p>{order.address || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>📱 Phone</label>
                                        <p>{order.phone || 'N/A'}</p>
                                    </div>
                                    <div className="info-item">
                                        <label>✉️ Email</label>
                                        <p>{order.email || 'N/A'}</p>
                                    </div>
                                </div>
                                
                                <div className="order-status-section">
                                    <div className="current-status">
                                        <span className="status-label">Current Status:</span>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusBadgeColor(order.status) }}
                                        >
                                            {getStatusEmoji(order.status)} {order.status || "Pending"}
                                        </span>
                                    </div>
                                    
                                    <div className="status-update-section">
                                        <label htmlFor={`status-${order._id}`}>Update Status:</label>
                                        <select
                                            id={`status-${order._id}`}
                                            value={order.status || "Pending"}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            disabled={updating[order._id] || isFinalStatus(order.status)}
                                            className="status-select"
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {isFinalStatus(order.status) && (
                                            <span className="final-status-badge">🔒 Final Status</span>
                                        )}
                                        {updating[order._id] && (
                                            <span className="updating-text">Updating...</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="order-actions">
                                    <button 
                                        onClick={() => DeleteOrder(order._id)}
                                        className="delete-btn"
                                    >
                                        🗑️ Delete Order
                                    </button>
                                </div>
                            </div>
                            
                            <div className='items'>
                                <h4>🛍️ Order Items:</h4>
                                {order.items?.map((item, i) => (
                                    <div key={i} className="item-row">
                                        <span>{item.name || `Item ${i + 1}`}</span>
                                        <span>Qty: {item.quantity || 1}</span>
                                        <span>Rs: {item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}