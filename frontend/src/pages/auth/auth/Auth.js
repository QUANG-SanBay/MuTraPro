import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Auth.module.scss'
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import AuthAction from './action/AuthAction';

function Login(){
    return(
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.authHeader}>
                    <div className={styles.authIcon}>
                        <span>
                            <FontAwesomeIcon icon={faMusic}/>
                        </span>
                    </div>
                    <div className={styles.authIntro}>
                        <h1 className={styles.authTitle}>Hệ thống MuTraPro</h1>
                        <p className={styles.authDescription}>Quản lý phục vụ âm nhạc chuyên nghiệp</p>
                    </div>
                </div>
                <AuthAction className={styles.authAction}>
                    
                </AuthAction>
            </div>
        </div>
    )
}
export default Login;