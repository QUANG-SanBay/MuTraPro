import { useNavigate } from 'react-router-dom';
import styles from './Unauthorized.module.scss';

function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                            fill="#EF4444"
                        />
                    </svg>
                </div>
                <h1 className={styles.title}>Không có quyền truy cập</h1>
                <p className={styles.message}>
                    Bạn không có quyền truy cập vào trang này.
                    <br />
                    Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
                </p>
                <div className={styles.actions}>
                    <button 
                        onClick={() => navigate(-1)}
                        className={styles.backButton}
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className={styles.homeButton}
                    >
                        Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;
