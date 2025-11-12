import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasAnyRole } from '~/utils/auth';

/**
 * Protected Route Component
 * Redirects to /auth if user is not authenticated
 * Optionally checks for specific roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string[]} props.allowedRoles - Optional array of allowed roles
 * @param {string} props.redirectTo - Optional redirect path (default: '/auth')
 */
function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/auth' }) {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check if user has required role (if roles are specified)
    if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        // Redirect to unauthorized page or home
        return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has required role
    return children;
}

export default ProtectedRoute;
