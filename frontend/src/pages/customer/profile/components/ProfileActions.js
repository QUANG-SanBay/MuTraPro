import styles from '../Profile.module.scss';

function ProfileActions({ isEditing, isSaving, onSubmit, onEdit, onCancel, onChangePassword }) {
    return (
        <div className={styles.actions}>
            {isEditing ? (
                <>
                    <button 
                        type="submit" 
                        className={styles.btnPrimary} 
                        onClick={onSubmit}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.btnSecondary}
                        disabled={isSaving}
                    >
                        Hủy
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={onEdit}
                        className={styles.btnPrimary}
                    >
                        Chỉnh sửa thông tin
                    </button>
                    <button
                        type="button"
                        onClick={onChangePassword}
                        className={styles.btnSecondary}
                    >
                        Đổi mật khẩu
                    </button>
                </>
            )}
        </div>
    );
}

export default ProfileActions;
