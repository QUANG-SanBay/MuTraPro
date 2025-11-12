import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '~/components/logo/Logo';
import styles from './Header.module.scss';
import HeaderNav from './headerNav/HeaderNav';
import HeaderProfile from './headerProfile/HeaderProfile';
import HeaderNotification from './headerNotification/HeaderNotification';
import HeaderMobileToggle from './headerMobileToggle/HeaderMobileToggle';

function Header({ type }) {
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

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/customer" className={styles.logoWrapper}>
                    <Logo className={styles.logo} />
                </Link>

                <HeaderNav 
                    mobileMenuOpen={mobileMenuOpen} 
                    onNavClick={handleNavClick}
                />

                <div className={styles.actions}>
                    <HeaderNotification
                        isOpen={notificationOpen}
                        onToggle={toggleNotification}
                        onClose={handleNotificationClose}
                    />

                    <HeaderProfile
                        isOpen={profileDropdownOpen}
                        onToggle={toggleProfileDropdown}
                    />

                    <HeaderMobileToggle
                        isOpen={mobileMenuOpen}
                        onToggle={toggleMobileMenu}
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;