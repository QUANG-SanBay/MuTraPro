import styles from '../Profile.module.scss';

function ProfileAvatar({ avatarPreview, isEditing, onAvatarChange }) {
    return (
        <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
                {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className={styles.avatar} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                )}
            </div>
            {isEditing && (
                <label className={styles.avatarUpload}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className={styles.fileInput}
                    />
                    <span>Thay đổi ảnh</span>
                </label>
            )}
        </div>
    );
}

export default ProfileAvatar;
