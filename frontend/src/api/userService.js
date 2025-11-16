import { callGateway } from './gateway';

/**
 * User Service API calls
 */

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - Email address
 * @param {string} userData.fullName - Full name
 * @param {string} userData.password - Password
 * @param {string} userData.rePassword - Password confirmation
 * @returns {Promise<Object>} Response with user data (username auto-generated)
 */
export async function registerUser({ email, fullName, password, rePassword }) {
  return callGateway({
    service: 'user-service',
    path: '/users/register',
    method: 'POST',
    requireAuth: false, // Public endpoint
    body: {
      email,
      full_name: fullName,
      password,
      re_password: rePassword
    }
  });
}

/**
 * Test user service connection
 * @returns {Promise<Object>} Response with service info
 */
export async function testUserService() {
  return callGateway({
    service: 'user-service',
    path: '/users/hello',
    method: 'GET',
    requireAuth: false // Public endpoint
  });
}

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Response with user data and JWT tokens
 */
export async function loginUser({ email, password }) {
  return callGateway({
    service: 'user-service',
    path: '/users/login',
    method: 'POST',
    requireAuth: false, // Public endpoint
    body: {
      email,
      password
    }
  });
}

/**
 * Get current user profile - Requires authentication
 * JWT token is automatically added by callGateway
 * @returns {Promise<Object>} Response with user profile data
 */
export async function getProfile() {
  return callGateway({
    service: 'user-service',
    path: '/users/me',
    method: 'GET'
  });
}

/**
 * Update current user profile - Requires authentication
 * JWT token is automatically added by callGateway
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.full_name - Full name (optional)
 * @param {string} profileData.phone_number - Phone number (optional)
 * @param {string} profileData.gender - Gender: male|female|other (optional)
 * @returns {Promise<Object>} Response with updated user profile data
 */
export async function updateProfile({ full_name, phone_number, gender }) {
  return callGateway({
    service: 'user-service',
    path: '/users/me',
    method: 'PUT',
    body: {
      full_name,
      phone_number,
      gender
    }
  });
}

/**
 * Change user password - Requires authentication
 * JWT token is automatically added by callGateway
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.old_password - Current password
 * @param {string} passwordData.new_password - New password
 * @param {string} passwordData.confirm_password - Confirm new password
 * @returns {Promise<Object>} Response with success message
 */
export async function changePassword({ old_password, new_password, confirm_password }) {
  return callGateway({
    service: 'user-service',
    path: '/users/change-password',
    method: 'PUT',
    body: {
      old_password,
      new_password,
      confirm_password
    }
  });
}

/**
 * Check current user's role and permissions - Requires authentication
 * @returns {Promise<Object>} Response with user role and permissions
 */
export async function checkRoleAccess() {
  return callGateway({
    service: 'user-service',
    path: '/users/check-role',
    method: 'GET'
  });
}

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get all users - Requires Admin role
 * @returns {Promise<Object>} Response with list of all users
 */
export async function adminGetAllUsers() {
  return callGateway({
    service: 'user-service',
    path: '/users/admin/users',
    method: 'GET'
  });
}

/**
 * Get user by ID - Requires Admin or Studio Administrator role
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Response with user details
 */
export async function adminGetUserById(userId) {
  return callGateway({
    service: 'user-service',
    path: `/users/admin/users/${userId}`,
    method: 'GET'
  });
}

/**
 * Update user active status - Requires Admin role
 * @param {number} userId - User ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<Object>} Response with updated user
 */
export async function adminUpdateUserStatus(userId, isActive) {
  return callGateway({
    service: 'user-service',
    path: `/users/admin/users/${userId}/status`,
    method: 'PUT',
    body: {
      is_active: isActive
    }
  });
}

