import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './AlreadyLoggedIn.module.scss';
import { clearAuthData, getUserRole, getRoleBasedHomeRoute } from '~/utils/auth';

function AlreadyLoggedIn({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthData();
        if (onLogout) {
            onLogout();
        }
    };

    const handleGoBack = () => {
        const homeRoute = getRoleBasedHomeRoute();
        navigate(homeRoute);
    };

    const getRoleDisplayName = (role) => {
        switch(role) {
            case 'admin':
                return 'Quản trị viên';
            case 'customer':
                return 'Khách hàng';
            case 'service_coordinator':
                return 'Điều phối viên';
            case 'transcription_specialist':
                return 'Chuyên viên ký âm';
            case 'arrangement_specialist':
                return 'Chuyên viên phối khí';
            case 'recording_artist':
                return 'Nghệ sĩ thu âm';
            case 'studio_administrator':
                return 'Quản lý studio';
            default:
                return role;
        }
    };

    return (
        <div className={styles.alreadyLoggedIn}>
            <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
            </div>
            
            <h2 className={styles.title}>Bạn đã đăng nhập</h2>
            
            <div className={styles.userInfo}>
                <p className={styles.userName}>{user?.full_name || user?.email}</p>
                <span className={styles.userRole}>{getRoleDisplayName(user?.role)}</span>
            </div>
            
            <p className={styles.message}>
                Bạn muốn đăng nhập lại với tài khoản khác?
            </p>
            
            <div className={styles.actions}>
                <button 
                    className={styles.btnGoBack}
                    onClick={handleGoBack}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Quay lại</span>
                </button>
                
                <button 
                    className={styles.btnLogout}
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default AlreadyLoggedIn;
