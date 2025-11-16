import { Link, useLocation } from 'react-router-dom';
import styles from './HeaderNav.module.scss';

function HeaderNav({ mobileMenuOpen, onNavClick, userType = 'customer' }) {

    const location = useLocation();

    const isActiveRoute = (path) => {
        // Determine base path for home page based on userType
        const homePath = userType === 'admin' ? '/admin' : 
                        userType === 'service_coordinator' ? '/coordinator' :
                        userType === 'specialist' ? '/specialist' :
                        userType === 'studio_administrator' ? '/studio' :
                        '/customer';
        
        // Exact match for home page
        if (path === homePath) {
            return location.pathname === homePath || location.pathname === homePath + '/';
        }
        // For other routes, check if pathname starts with the path
        return location.pathname.startsWith(path);
    };

    // Define navigation links based on userType
    const getNavLinks = () => {
        switch(userType) {
            case 'admin':
                return [
                    { to: '/admin', label: 'Trang chủ' },
                    { to: '/admin/users', label: 'QL User' },
                    { to: '/admin/permissions', label: 'QL phân quyền' },
                    { to: '/admin/reports', label: 'BCáo & TKê' },
                ];
            
            case 'service_coordinator':
                return [
                    { to: '/coordinator', label: 'Trang chủ' },
                    // Add coordinator navigation here
                ];
            
            case 'specialist':
                return [
                    { to: '/specialist', label: 'Trang chủ' },
                    { to: '/specialist/tasks', label: 'Công việc' },
                    // Add specialist navigation here
                ];
            
            case 'studio_administrator':
                return [
                    { to: '/studio', label: 'Trang chủ' },
                    // Add studio admin navigation here
                ];
            
            case 'customer':
            default:
                return [
                    { to: '/customer', label: 'Trang chủ' },
                    { to: '/customer/services', label: 'Dịch vụ' },
                    { to: '/customer/orders', label: 'Đơn hàng' },
                    { to: '/customer/payments', label: 'Thanh toán' },
                ];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
            {navLinks.map((link) => (
                <Link
                    key={link.to}
                    to={link.to}
                    className={`${styles.navLink} ${isActiveRoute(link.to) ? styles.navLinkActive : ''}`}
                    onClick={onNavClick}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}

export default HeaderNav;
