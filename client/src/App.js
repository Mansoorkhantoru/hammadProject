import React, { useState , useEffect} from 'react'
import {Routes , Route , BrowserRouter} from 'react-router-dom'
import Home from './component/Home'
import ProductDetails from './component/ProductDetail'
import TrackOrder from './component/TrackOrder'

export default function App() {
  const [cart , setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })
  
  const addToCart = (product) => {
    setCart((prevCart) => {
      const updated = [...prevCart , product]
      return updated
    })
  }
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])
  
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter(item => item._id !== id)
    )
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route 
            element={
              <Home 
                addToCart={addToCart} 
                cart={cart} 
                setCart={setCart}
                removeFromCart={removeFromCart} 
              />
            } 
            path='/'
          />
          <Route 
            element={
              <ProductDetails 
                addToCart={addToCart} 
                cart={cart}
              />
            } 
            path='/product/:id'
          />
          {/* ✅ Fixed: Pass cart props to TrackOrder */}
          <Route 
            path="/trackorder" 
            element={
              <TrackOrder 
                cart={cart}
                setCart={setCart}
                removeFromCart={removeFromCart}
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}