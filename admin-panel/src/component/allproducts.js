import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./allproduct.css"
import Sidebar from './sidebar'

export default function Allproducts() {
    const [allProducts, setAllProducts] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    
    const fetchData = async() => {
        try {
            setLoading(true)
            const res = await axios.get("http://localhost:3000/allproduct") 
            setAllProducts(res.data.products || [])
        } catch(error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchData()
    }, [])
    
    const deleteProduct = async(productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const response = await axios.delete(`http://localhost:3000/allproduct/${productId}`)
            if(response.data.success) {
                setAllProducts(allProducts.filter(product => product._id !== productId))
                alert('Product deleted successfully')
            } else {
                alert("Failed to Delete Product: " + response.data.message)
            }
        } catch(error) {
            console.error("Error deleting product:", error)
            alert('Failed to delete product')
        }
    }
    
    return (
        <div className='allproducts'>
            <Sidebar className='sideBar'/>
            
            <div className="products-container">
                <div className="products-header">
                    <h1>📦 Product Management</h1>
                    <div className="header-actions">
                        <input 
                            type="text" 
                            placeholder='🔍 Search products...'
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            className="search-input"
                        />
                        <span className="product-count">{allProducts.length} products</span>
                    </div>
                </div>
                
                <div className="products-list">
                    {loading ? (
                        <div className="loading-state">Loading products...</div>
                    ) : allProducts.length === 0 ? (
                        <div className="empty-state">
                            <p>📭 No products available</p>
                            <p className="empty-sub">Add your first product to get started</p>
                        </div>
                    ) : (
                        allProducts
                            .filter((product) =>
                                product.name?.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((product, index) => (
                                <div key={product._id || index} className='product-row'>
                                    <div className="product-row-image">
                                        {product.imageUrl ? (
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image">📷</div>
                                        )}
                                    </div>
                                    
                                    <div className="product-row-info">
                                        <div className="product-row-name">
                                            <h3>{product.name}</h3>
                                            {product.requiresPrescription && (
                                                <span className="prescription-badge">Rx Required</span>
                                            )}
                                        </div>
                                        <div className="product-row-prices">
                                            <span className="current-price">Rs. {product.discountPrice || product.price}</span>
                                            {product.price && product.discountPrice && product.price !== product.discountPrice && (
                                                <span className="original-price">Rs. {product.price}</span>
                                            )}
                                        </div>
                                        {product.description && (
                                            <p className="product-row-description">{product.description}</p>
                                        )}
                                    </div>
                                    
                                    <div className="product-row-actions">
                                        <button 
                                            onClick={() => deleteProduct(product._id)}
                                            className="delete-btn"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    )
}