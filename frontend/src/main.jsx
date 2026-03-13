import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { CartProvider } from './app/core/services/cart.context'
import { ThemeProvider } from './app/core/services/theme.context'
import { ToastProvider } from './app/core/services/toast.context'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
)
