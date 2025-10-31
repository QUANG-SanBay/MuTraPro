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
    // const [userSvcMsg, setUserSvcMsg] = useState(null);
    // const [userSvcErr, setUserSvcErr] = useState(null);
    const handleActive = (mode)=>{
        setIsLogin(mode === 'loginBtn');
    }

    // Demo: call user-service via gateway and show result
    // useEffect(() => {
    //     let mounted = true;
    //     (async () => {
    //         try {
    //             const data = await callGateway({
    //                 service: 'user',
    //                 path: '/api/hello',
    //                 method: 'GET'
    //             });
    //             if (mounted) setUserSvcMsg(data?.message || JSON.stringify(data));
    //         } catch (e) {
    //             if (mounted) setUserSvcErr(e?.data || e?.message);
    //         }
    //     })();
    //     return () => { mounted = false };
    // }, []);
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
                        {/* Quick user-service check */}
                        {/* {userSvcMsg && <p className={styles.userSvcOk}>UserSvc: {userSvcMsg}</p>}
                        {userSvcErr && <p className={styles.userSvcErr}>UserSvc error: {typeof userSvcErr === 'string' ? userSvcErr : JSON.stringify(userSvcErr)}</p>} */}
                    </div>
                </div>
                <AuthAction active={isLogin} onClick={handleActive}></AuthAction>
                {isLogin ? 
                <LoginForm></LoginForm> : 
                <RegisterForm></RegisterForm>}
            </div>
        </div>
    )
}
export default Login;