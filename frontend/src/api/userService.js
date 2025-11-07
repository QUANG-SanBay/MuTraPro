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
    method: 'GET'
  });
}
