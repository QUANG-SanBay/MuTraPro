import { Link, useLocation } from 'react-router-dom';
import styles from './HeaderNav.module.scss';

function HeaderNav({ mobileMenuOpen, onNavClick }) {
    const location = useLocation();

    const isActiveRoute = (path) => {
        // Exact match for home page
        if (path === '/customer') {
            return location.pathname === '/customer' || location.pathname === '/customer/';
        }
        // For other routes, check if pathname starts with the path
        return location.pathname.startsWith(path);
    };

    const navLinks = [
        { to: '/customer', label: 'Trang chủ' },
        { to: '/services', label: 'Dịch vụ' },
        { to: '/orders', label: 'Đơn hàng' },
        { to: '/payments', label: 'Thanh toán' },
    ];

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
