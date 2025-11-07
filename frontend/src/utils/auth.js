/**
 * Authentication utility functions
 */

/**
 * Get access token from localStorage
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

/**
 * Get user info from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Save authentication data to localStorage
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 * @param {Object} user - User object
 */
export const saveAuthData = (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid tokens
 */
export const isAuthenticated = () => {
    const token = getAccessToken();
    const user = getUser();
    return !!(token && user);
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (role) => {
    const user = getUser();
    return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export const hasAnyRole = (roles) => {
    const user = getUser();
    return roles.includes(user?.role);
};

/**
 * Get authorization header for API requests
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
