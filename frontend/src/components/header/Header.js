import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '~/components/logo/Logo';
import styles from './Header.module.scss';
import HeaderNav from './headerNav/HeaderNav';
import HeaderProfile from './headerProfile/HeaderProfile';
import HeaderNotification from './headerNotification/HeaderNotification';
import HeaderMobileToggle from './headerMobileToggle/HeaderMobileToggle';

function Header({ userType = 'customer' }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        setNotificationOpen(false);
    };

    const toggleNotification = () => {
        setNotificationOpen(!notificationOpen);
        setProfileDropdownOpen(false);
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    const handleNotificationClose = () => {
        setNotificationOpen(false);
    };

    // Determine home route based on userType
    const getHomeRoute = () => {
        switch(userType) {
            case 'admin':
                return '/admin';
            case 'service_coordinator':
                return '/coordinator';
            case 'specialist':
                return '/specialist';
            case 'studio_administrator':
                return '/studio';
            case 'customer':
            default:
                return '/customer';
        }
    };

    // Determine which components to show based on userType
    const showNavbar = userType === 'customer' || userType === 'service_coordinator' || userType === 'specialist' || userType === 'studio_administrator';
    const showNotification = userType === 'customer' || userType === 'service_coordinator' || userType === 'specialist' || userType === 'studio_administrator';
    const showMobileToggle = showNavbar; // Only show mobile toggle if navbar exists

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to={getHomeRoute()} className={styles.logoWrapper}>
                    <Logo className={styles.logo} />
                </Link>

                {/* Show navbar for customer and other roles (not admin) */}
                {showNavbar && (
                    <HeaderNav 
                        userType={userType}
                        mobileMenuOpen={mobileMenuOpen} 
                        onNavClick={handleNavClick}
                    />
                )}

                <div className={styles.actions}>
                    {/* Show notification for customer and other roles (not admin) */}
                    {showNotification && (
                        <HeaderNotification
                            isOpen={notificationOpen}
                            onToggle={toggleNotification}
                            onClose={handleNotificationClose}
                        />
                    )}

                    {/* Always show profile dropdown */}
                    <HeaderProfile
                        userType={userType}
                        isOpen={profileDropdownOpen}
                        onToggle={toggleProfileDropdown}
                    />

                    {/* Show mobile toggle only if navbar exists */}
                    {showMobileToggle && (
                        <HeaderMobileToggle
                            isOpen={mobileMenuOpen}
                            onToggle={toggleMobileMenu}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;