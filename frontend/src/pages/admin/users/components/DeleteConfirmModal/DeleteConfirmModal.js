import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from './DeleteConfirmModal.module.scss';
import { deleteUser } from '~/api/adminService';

const DeleteConfirmModal = ({ user, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Handle delete confirmation
     */
    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await deleteUser(user.id);

            // Backend returns: { message, user }
            if (response && response.message) {
                onSuccess(`Đã xóa người dùng "${user.full_name}" thành công`);
            } else {
                setError(response?.message || 'Không thể xóa người dùng');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi xóa người dùng');
            console.error('Error deleting user:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle modal overlay click
     */
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                {/* Modal Header */}
                <div className={styles.modalHeader}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
                    <h2>Xác nhận xóa người dùng</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className={styles.modalBody}>
                    {error && (
                        <div className={styles.errorAlert}>
                            {error}
                        </div>
                    )}

                    <div className={styles.confirmMessage}>
                        <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                        
                        <div className={styles.userInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Họ và tên:</span>
                                <span className={styles.value}>{user?.full_name}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>{user?.email}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Vai trò:</span>
                                <span className={styles.value}>{user?.role}</span>
                            </div>
                        </div>

                        <div className={styles.warningNote}>
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            <span>Lưu ý: Người dùng sẽ bị vô hiệu hóa và không thể đăng nhập vào hệ thống.</span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className={styles.modalFooter}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
