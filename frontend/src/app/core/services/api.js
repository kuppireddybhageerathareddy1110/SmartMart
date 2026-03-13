import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// Attach JWT automatically (if exists)
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }

  return config
})

// Response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Network error - server unreachable
      throw new Error("Server unreachable. Please check your connection and try again.")
    }
    return Promise.reject(error)
  }
)

// Products API
export const productsApi = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post("/products", product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
}

// Orders API
export const ordersApi = {
  getMyOrders: () => api.get("/orders"),
  placeOrder: (order) => api.post("/orders", order),
}

// Cart API
export const cartApi = {
  get: () => api.get("/cart"),
  add: (item) => api.post("/cart", item),
  remove: (id) => api.delete(`/cart/${id}`),
}

// Auth API
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
}

// Admin API
export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAllUsers: () => api.get("/admin/users"),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, null, { params: { role } }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
}

// Shopkeeper API
export const shopkeeperApi = {
  getPendingOrders: () => api.get("/shopkeeper/orders"),
  fulfillOrder: (orderId, status) => api.put(`/shopkeeper/orders/${orderId}/fulfill`, { status }),
}

// Delivery API
export const deliveryApi = {
  getAssignedDeliveries: () => api.get("/delivery/assigned"),
  updateDeliveryStatus: (deliveryId, status, currentLocation) =>
    api.put(`/delivery/${deliveryId}/status`, { status, currentLocation }),
}

// Warehouse API
export const warehouseApi = {
  getWarehouses: () => api.get("/warehouse"),
  createWarehouse: (warehouse) => api.post("/warehouse", warehouse),
  updateStock: (warehouseId, productId, quantity) =>
    api.put(`/warehouse/${warehouseId}/stock`, { productId, quantity }),
}

// Timeline API
export const timelineApi = {
  getOrderTimeline: (orderId) => api.get(`/timeline/order/${orderId}`),
}

// SAP API
export const sapApi = {
  syncToSAP: (entityType, entityId) => api.post("/sap/sync", { entityType, entityId }),
  getSyncHistory: () => api.get("/sap/sync/history"),
}

export default api
