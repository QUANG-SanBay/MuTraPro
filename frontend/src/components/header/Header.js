import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '~/components/logo/Logo';
import styles from './Header.module.scss';

function Header({ type }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const handleLogout = () => {
        // Logic đăng xuất (xóa token, redirect...)
        console.log('Logging out...');
        navigate('/auth');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link to="/customer" className={styles.logoWrapper}>
                    <Logo className={styles.logo} />
                </Link>

                {/* Navigation - Desktop */}
                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
                    <Link 
                        to="/customer" 
                        className={`${styles.navLink} ${isActiveRoute('/customer') ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Trang chủ
                    </Link>
                    <Link 
                        to="/services" 
                        className={`${styles.navLink} ${isActiveRoute('/services') ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Dịch vụ
                    </Link>
                    <Link 
                        to="/orders" 
                        className={`${styles.navLink} ${isActiveRoute('/orders') ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Đơn hàng
                    </Link>
                    <Link 
                        to="/payments" 
                        className={`${styles.navLink} ${isActiveRoute('/payments') ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Thanh toán
                    </Link>
                </nav>

                {/* Right side: Notification + Avatar */}
                <div className={styles.actions}>
                    {/* Notification Bell with Dropdown */}
                    <div className={styles.notificationWrapper}>
                        <button 
                            className={styles.iconButton} 
                            aria-label="Thông báo"
                            onClick={toggleNotification}
                            aria-expanded={notificationOpen}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className={styles.badge}>3</span>
                        </button>

                        {/* Notification Dropdown */}
                        {notificationOpen && (
                            <div className={styles.notificationDropdown}>
                                <div className={styles.notificationHeader}>
                                    <h3>Thông báo</h3>
                                    <button className={styles.markAllRead}>Đánh dấu đã đọc</button>
                                </div>
                                <div className={styles.notificationList}>
                                    <div className={styles.notificationItem}>
                                        <div className={styles.notificationDot}></div>
                                        <div className={styles.notificationContent}>
                                            <p className={styles.notificationText}>
                                                Đơn hàng <strong>#12345</strong> đã được xác nhận
                                            </p>
                                            <span className={styles.notificationTime}>5 phút trước</span>
                                        </div>
                                    </div>
                                    <div className={styles.notificationItem}>
                                        <div className={styles.notificationDot}></div>
                                        <div className={styles.notificationContent}>
                                            <p className={styles.notificationText}>
                                                Bạn có một tin nhắn mới từ <strong>Studio A</strong>
                                            </p>
                                            <span className={styles.notificationTime}>1 giờ trước</span>
                                        </div>
                                    </div>
                                    <div className={styles.notificationItem}>
                                        <div className={styles.notificationDot}></div>
                                        <div className={styles.notificationContent}>
                                            <p className={styles.notificationText}>
                                                Thanh toán cho đơn hàng <strong>#12340</strong> thành công
                                            </p>
                                            <span className={styles.notificationTime}>2 giờ trước</span>
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    to="/notifications" 
                                    className={styles.notificationFooter}
                                    onClick={() => setNotificationOpen(false)}
                                >
                                    Xem tất cả thông báo
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Avatar with Dropdown */}
                    <div className={styles.profileWrapper}>
                        <button
                            className={styles.avatarButton}
                            onClick={toggleProfileDropdown}
                            aria-label="Tài khoản"
                            aria-expanded={profileDropdownOpen}
                        >
                            <div className={styles.avatar}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`${styles.chevron} ${profileDropdownOpen ? styles.chevronOpen : ''}`}
                            >
                                <path
                                    d="M4 6L8 10L12 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {profileDropdownOpen && (
                            <div className={styles.dropdown}>
                                <Link
                                    to="/profile"
                                    className={styles.dropdownItem}
                                    onClick={() => setProfileDropdownOpen(false)}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Hồ sơ của bạn
                                </Link>
                                <button
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        setProfileDropdownOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M16 17L21 12L16 7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M21 12H9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.hamburger}
                        onClick={toggleMobileMenu}
                        aria-label="Menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                        <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                        <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;