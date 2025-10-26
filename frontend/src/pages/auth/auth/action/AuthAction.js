import clsx from 'clsx';
import styles from './AuthAction.module.scss'

function AuthAction({onClick, active, className}){
    const handleClick = (e)=>{
        onClick(e.target.name)
    }
    return(
        <div className={clsx( styles.authAction ,className)}>
            <button onClick={handleClick}
                name='loginBtn'
                type="button"
                className={clsx(styles.actionBtn, {
                [styles.active]: active
            })}>
                Đăng nhập
            </button>
            <button onClick={handleClick}
                name='registerBtn'
                className={clsx(styles.actionBtn, {
                [styles.active]: !active
            })}>
                Đăng ký
            </button>
        </div>
    )
}
export default AuthAction;