import styles from '../Profile.module.scss';

function ProfileHeader() {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>Quản lý tài khoản cá nhân</h1>
            <p className={styles.subtitle}>Cập nhật thông tin tài khoản của bạn</p>
        </div>
    );
}

export default ProfileHeader;
