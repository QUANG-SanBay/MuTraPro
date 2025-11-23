import { Link, useNavigate } from 'react-router-dom';
import styles from './HeaderProfile.module.scss';
import { clearAuthData, getUser } from '~/utils/auth';
import { useEffect, useState } from 'react';

function HeaderProfile({ isOpen, onToggle, userType }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load user info from localStorage
        const userData = getUser();
        setUser(userData);
    }, []);

    const handleLogout = () => {
        // Xóa JWT tokens và thông tin user khỏi localStorage
        clearAuthData();
        
        // Chuyển hướng về trang đăng nhập
        navigate('/auth');
    };
    const getProfileLink = () => {
        if (userType === 'admin') {
            return '/admin/profile';
        }
        return '/customer/profile';
    };
    return (
        <div className={styles.profileWrapper}>
            <button
                className={styles.avatarButton}
                onClick={onToggle}
                aria-label="Tài khoản"
                aria-expanded={isOpen}
                title={user?.full_name || user?.email || 'Tài khoản'}
            >
                <div className={styles.avatar}>
                    {user?.full_name ? (
                        <span className={styles.avatarText}>
                            {user.full_name.charAt(0).toUpperCase()}
                        </span>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                    )}
                </div>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
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

            {isOpen && (
                <div className={styles.dropdown}>
                    {user && (
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user.full_name}</div>
                            <div className={styles.userEmail}>{user.email}</div>
                        </div>
                    )}
                    <Link to={getProfileLink()} className={styles.dropdownItem} onClick={onToggle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                            onToggle();
                            handleLogout();
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    );
}

export default HeaderProfile;
