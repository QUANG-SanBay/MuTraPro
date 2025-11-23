import { callGateway } from "./gateway";

/**
 * Admin Service API
 * Handles all admin-related API calls
 */

// ==================== USER MANAGEMENT ====================

/**
 * Get all users
 * @returns {Promise} - Response with users array
 */
export const getAllUsers = async () => {
    return await callGateway({
        service: 'user-service',
        path: '/users/admin/users',
        method: 'GET'
    });
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise} - Response with user object
 */
export const getUserById = async (userId) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/admin/users/${userId}`,
        method: 'GET'
    });
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.full_name - User full name
 * @param {string} userData.password - User password
 * @param {string} userData.re_password - Confirm password
 * @param {string} userData.phone_number - User phone number (optional)
 * @param {string} userData.gender - User gender (optional)
 * @param {string} userData.role - User role (optional, default: customer)
 * @returns {Promise} - Response with created user
 */
export const createUser = async (userData) => {
    return await callGateway({
        service: 'user-service',
        path: '/users/admin/users/create',
        method: 'POST',
        body: userData
    });
};

/**
 * Update user information
 * @param {number} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Response with updated user
 */
export const updateUser = async (userId, userData) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/admin/users/${userId}/update`,
        method: 'PUT',
        body: userData
    });
};

/**
 * Update user active status
 * @param {number} userId - User ID
 * @param {boolean} isActive - Active status
 * @returns {Promise} - Response with updated user
 */
export const updateUserStatus = async (userId, isActive) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/admin/users/${userId}/status`,
        method: 'PUT',
        body: { is_active: isActive }
    });
};

/**
 * Delete user (soft delete by setting is_active to false)
 * @param {number} userId - User ID
 * @returns {Promise} - Response
 */
export const deleteUser = async (userId) => {
    return await updateUserStatus(userId, false);
};

/**
 * Search users
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query (email, full_name, username)
 * @param {string} params.role - Filter by role
 * @param {boolean} params.is_active - Filter by active status
 * @returns {Promise} - Response with filtered users
 */
export const searchUsers = async (params) => {
    // For now, we'll fetch all users and filter client-side
    // In the future, backend should support query parameters
    const response = await getAllUsers();
    
    // Backend returns: { message, total, users }
    if (!response || !response.users) {
        return response;
    }
    
    let users = response.users || [];
    
    // Filter by search query
    if (params.query) {
        const query = params.query.toLowerCase();
        users = users.filter(user => 
            user.email?.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query) ||
            user.username?.toLowerCase().includes(query)
        );
    }
    
    // Filter by role
    if (params.role && params.role !== 'all') {
        users = users.filter(user => user.role === params.role);
    }
    
    // Filter by active status
    if (params.is_active !== undefined && params.is_active !== null && params.is_active !== 'all') {
        users = users.filter(user => user.is_active === params.is_active);
    }
    
    return {
        ...response,
        users,
        total: users.length
    };
};

// ==================== ROLE MANAGEMENT ====================

/**
 * Get all available roles
 * @returns {Array} - Array of role objects
 */
export const getAllRoles = () => {
    return [
        { value: 'customer', label: 'Khách hàng' },
        { value: 'service_coordinator', label: 'Điều phối viên' },
        { value: 'transcription_specialist', label: 'Chuyên gia phiên âm' },
        { value: 'arrangement_specialist', label: 'Chuyên gia hòa âm' },
        { value: 'recording_artist', label: 'Nghệ sĩ thu âm' },
        { value: 'studio_administrator', label: 'Quản trị viên studio' },
        { value: 'admin', label: 'Quản trị viên hệ thống' }
    ];
};

/**
 * Get role display name
 * @param {string} roleValue - Role value
 * @returns {string} - Role label in Vietnamese
 */
export const getRoleDisplayName = (roleValue) => {
    const roles = getAllRoles();
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
};

// ==================== STATISTICS ====================

/**
 * Get user statistics
 * @returns {Promise} - Response with statistics
 */
export const getUserStatistics = async () => {
    const response = await getAllUsers();
    
    // Backend returns: { message, total, users }
    if (!response || !response.users) {
        return response;
    }
    
    const users = response.users || [];
    
    // Calculate statistics
    const stats = {
        total: users.length,
        active: users.filter(u => u.is_active).length,
        inactive: users.filter(u => !u.is_active).length,
        byRole: {}
    };
    
    // Count users by role
    users.forEach(user => {
        if (!stats.byRole[user.role]) {
            stats.byRole[user.role] = 0;
        }
        stats.byRole[user.role]++;
    });
    
    return {
        message: 'Thống kê người dùng thành công',
        ...stats
    };
};


// ==================== PERMISSION MANAGEMENT ====================

/**
 * Get all available permissions
 * @returns {Promise} - Response with permissions array
 */
export const getAllPermissions = async () => {
    return await callGateway({
        service: 'user-service',
        path: '/users/permissions',
        method: 'GET'
    });
};

/**
 * Get all roles from backend API
 * @returns {Promise} - Response with roles array
 */
export const fetchAllRoles = async () => {
    return await callGateway({
        service: 'user-service',
        path: '/users/roles',
        method: 'GET'
    });
};

/**
 * Get permissions for a specific role
 * @param {string} role - Role name (e.g., 'customer', 'service_coordinator')
 * @returns {Promise} - Response with role permissions
 */
export const getRolePermissions = async (role) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/roles/${role}/permissions`,
        method: 'GET'
    });
};

/**
 * Update permissions for a role
 * @param {string} role - Role name
 * @param {Array<string>} permissions - Array of permission codenames
 * @returns {Promise} - Response with update result
 */
export const updateRolePermissions = async (role, permissions) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/roles/${role}/permissions/update`,
        method: 'PUT',
        body: { permissions }
    });
};

/**
 * Reset role permissions to default
 * @param {string} role - Role name
 * @returns {Promise} - Response with reset result
 */
export const resetRoleToDefault = async (role) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/roles/${role}/reset-default`,
        method: 'POST'
    });
};

/**
 * Check if current user has a specific permission
 * @param {string} permission - Permission codename
 * @returns {Promise} - Response with permission check result
 */
export const checkUserPermission = async (permission) => {
    return await callGateway({
        service: 'user-service',
        path: `/users/permissions/check?permission=${permission}`,
        method: 'GET'
    });
};
