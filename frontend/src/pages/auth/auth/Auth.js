import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

import styles from './Auth.module.scss'
import AuthAction from './action/AuthAction';
import RegisterForm from './registerForm/Register';
import LoginForm from './loginForm/LoginForm';
// import { callGateway } from '~/api/gateway';

function Login(){
    const [isLogin, setIsLogin] = useState(true);
    const handleActive = (mode)=>{
        setIsLogin(mode === 'loginBtn');
    }

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
                <AuthAction active={isLogin} onClick={handleActive}></AuthAction>
                {isLogin ? 
                <LoginForm></LoginForm> : 
                <RegisterForm setIsLogin={setIsLogin}></RegisterForm>}
            </div>
        </div>
    )
}
export default Login;