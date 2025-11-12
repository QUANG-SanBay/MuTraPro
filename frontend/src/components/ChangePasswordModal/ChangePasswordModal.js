import { useState } from 'react';
import styles from './ChangePasswordModal.module.scss';

function ChangePasswordModal({ isOpen, onClose, onSubmit, isLoading, error }) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleClose = () => {
        // Reset form on close
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowPasswords({
            old: false,
            new: false,
            confirm: false
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Đổi mật khẩu</h2>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="oldPassword" className={styles.label}>
                            Mật khẩu cũ <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPasswords.old ? 'text' : 'password'}
                                id="oldPassword"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                disabled={isLoading}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => togglePasswordVisibility('old')}
                                disabled={isLoading}
                            >
                                {showPasswords.old ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword" className={styles.label}>
                            Mật khẩu mới <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                disabled={isLoading}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => togglePasswordVisibility('new')}
                                disabled={isLoading}
                            >
                                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <p className={styles.hint}>
                            Mật khẩu phải có ít nhất 8 ký tự
                        </p>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Xác nhận mật khẩu mới <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                disabled={isLoading}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => togglePasswordVisibility('confirm')}
                                disabled={isLoading}
                            >
                                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={styles.btnCancel}
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={styles.btnSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
