import { createContext, useContext, useEffect, useState } from "react"
import { cartApi } from "./api"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart")
    return stored ? JSON.parse(stored) : []
  })

  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Sync with Backend on Load/Login
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      cartApi.get()
        .then(res => setCart(res.data))
        .catch(err => console.error("Failed to sync cart", err))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const add = (product) => {
    const token = localStorage.getItem("token")

    // Optimistic Update
    setCart(prev => {
      const item = prev.find(p => p.id === product.id)
      return item
        ? prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p)
        : [...prev, { ...product, qty: 1 }]
    })

    if (token) {
      // Backend Sync
      // Ideally backend handles qty, but for now simple add
      cartApi.add({ ...product, qty: 1 }).catch(err => console.error("Cart sync failed", err))
    }
  }

  const remove = (id) => {
    setCart(prev => prev.filter(p => p.id !== id))
    const token = localStorage.getItem("token")
    if (token) cartApi.remove(id).catch(e => console.error(e))
  }
  const decrease = (id) =>
    setCart(prev =>
      prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p).filter(p => p.qty > 0)
    )
  const clear = () => setCart([])

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      return exists
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    })
  }

  const isInWishlist = (id) => wishlist.some(p => p.id === id)

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      add,
      remove,
      decrease,
      clear,
      toggleWishlist,
      isInWishlist,
      total
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
