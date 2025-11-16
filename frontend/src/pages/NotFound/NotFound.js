import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './NotFound.module.scss';
import { isAuthenticated, getRoleBasedHomeRoute } from '~/utils/auth';

function NotFound() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoHome = () => {
        if (isAuthenticated()) {
            const homeRoute = getRoleBasedHomeRoute();
            navigate(homeRoute);
        } else {
            navigate('/auth');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.notFoundContainer}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
                </div>

                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.title}>Trang không tồn tại</h2>
                
                <p className={styles.message}>
                    Đường dẫn <strong>{location.pathname}</strong> không hợp lệ hoặc đã bị xóa.
                </p>

                <div className={styles.suggestions}>
                    <p className={styles.suggestionTitle}>Có thể bạn đang tìm:</p>
                    <ul className={styles.suggestionList}>
                        <li>Trang chủ của hệ thống</li>
                        <li>Trang đăng nhập</li>
                        <li>Trang bạn vừa truy cập trước đó</li>
                    </ul>
                </div>

                <div className={styles.actions}>
                    <button 
                        className={styles.btnGoBack}
                        onClick={handleGoBack}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Quay lại</span>
                    </button>
                    
                    <button 
                        className={styles.btnGoHome}
                        onClick={handleGoHome}
                    >
                        <FontAwesomeIcon icon={faHome} />
                        <span>Về trang chủ</span>
                    </button>
                </div>

                <div className={styles.helpText}>
                    <p>Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên.</p>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
