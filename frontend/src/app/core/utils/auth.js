// Helper to decode JWT token and get user role
export function getUserRole() {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
        // JWT tokens are in format: header.payload.signature
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        return decoded.role || "USER"
    } catch (error) {
        console.error("Failed to decode token:", error)
        return null
    }
}

// Helper to get user info from token
export function getUserInfo() {
    const token = localStorage.getItem("token")
    if (!token) return null

    try {
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        return {
            userId: decoded.userId,
            email: decoded.sub,
            role: decoded.role || "USER"
        }
    } catch (error) {
        console.error("Failed to decode token:", error)
        return null
    }
}
