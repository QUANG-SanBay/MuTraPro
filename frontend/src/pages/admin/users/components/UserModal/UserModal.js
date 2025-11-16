import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faLock, faPhone, faVenusMars, faUserTag } from '@fortawesome/free-solid-svg-icons';
import styles from './UserModal.module.scss';
import { createUser, updateUser, getAllRoles } from '~/api/adminService';

const UserModal = ({ mode, user, onClose, onSuccess }) => {
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        password: '',
        re_password: '',
        phone_number: '',
        gender: '',
        role: 'customer'
    });

    // Validation state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Get available roles
    const roles = getAllRoles();

    // Initialize form data when editing
    useEffect(() => {
        if (mode === 'edit' && user) {
            setFormData({
                email: user.email || '',
                full_name: user.full_name || '',
                password: '', // Don't pre-fill password
                re_password: '',
                phone_number: user.phone_number || '',
                gender: user.gender || '',
                role: user.role || 'customer'
            });
        }
    }, [mode, user]);

    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    /**
     * Validate form data
     */
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Full name validation
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Họ và tên không được để trống';
        } else if (formData.full_name.trim().length < 2) {
            newErrors.full_name = 'Họ và tên phải có ít nhất 2 ký tự';
        }

        // Password validation (only for create mode or if password is entered in edit mode)
        if (mode === 'create') {
            if (!formData.password) {
                newErrors.password = 'Mật khẩu không được để trống';
            } else if (formData.password.length < 8) {
                newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
            } else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
            } else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số';
            } else if (/^[0-9]+$/.test(formData.password)) {
                newErrors.password = 'Mật khẩu không được toàn bộ là số';
            }

            if (!formData.re_password) {
                newErrors.re_password = 'Vui lòng xác nhận mật khẩu';
            } else if (formData.password !== formData.re_password) {
                newErrors.re_password = 'Mật khẩu không khớp';
            }
        } else if (mode === 'edit' && formData.password) {
            // If password is entered in edit mode, validate it
            if (formData.password.length < 8) {
                newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
            } else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
            } else if (!/[0-9]/.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số';
            } else if (/^[0-9]+$/.test(formData.password)) {
                newErrors.password = 'Mật khẩu không được toàn bộ là số';
            }
            
            if (formData.password !== formData.re_password) {
                newErrors.re_password = 'Mật khẩu không khớp';
            }
        }

        // Phone validation (optional)
        if (formData.phone_number && !/^[0-9]{10,11}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = 'Vui lòng chọn vai trò';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle form submit
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            let response;
            
            if (mode === 'create') {
                // Create new user
                response = await createUser(formData);
            } else {
                // Update existing user
                // Only send fields that are filled
                const updateData = {
                    email: formData.email,
                    full_name: formData.full_name,
                    phone_number: formData.phone_number,
                    gender: formData.gender,
                    role: formData.role
                };
                
                // Add password only if it's provided
                if (formData.password) {
                    updateData.password = formData.password;
                    updateData.re_password = formData.re_password;
                }
                
                response = await updateUser(user.id, updateData);
            }

            // Backend returns: { message, user } or { message, errors }
            if (response && response.user) {
                onSuccess(
                    mode === 'create' 
                        ? 'Tạo người dùng mới thành công' 
                        : 'Cập nhật thông tin người dùng thành công'
                );
            } else {
                // Show error from API
                const apiErrors = response?.errors || {};
                setErrors({
                    general: response?.message || 'Có lỗi xảy ra',
                    ...apiErrors
                });
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            console.error('Error data:', err.data);
            
            // Extract backend validation errors if available
            const backendErrors = err.data?.errors || {};
            
            setErrors({
                general: err.data?.message || err.message || 'Có lỗi xảy ra khi gửi form',
                ...backendErrors
            });
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
                    <h2>
                        {mode === 'create' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className={styles.modalBody}>
                    {errors.general && (
                        <div className={styles.errorAlert}>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                <FontAwesomeIcon icon={faEnvelope} />
                                Email <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? styles.error : ''}
                                disabled={mode === 'edit'} // Email cannot be changed
                            />
                            {errors.email && (
                                <span className={styles.errorText}>{errors.email}</span>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="full_name">
                                <FontAwesomeIcon icon={faUser} />
                                Họ và tên <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={errors.full_name ? styles.error : ''}
                            />
                            {errors.full_name && (
                                <span className={styles.errorText}>{errors.full_name}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                <FontAwesomeIcon icon={faLock} />
                                Mật khẩu {mode === 'create' && <span className={styles.required}>*</span>}
                                {mode === 'edit' && <span className={styles.optional}> (Để trống nếu không đổi)</span>}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? styles.error : ''}
                                placeholder={mode === 'edit' ? 'Nhập mật khẩu mới nếu muốn thay đổi' : ''}
                            />
                            {errors.password && (
                                <span className={styles.errorText}>{errors.password}</span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="re_password">
                                <FontAwesomeIcon icon={faLock} />
                                Xác nhận mật khẩu {mode === 'create' && <span className={styles.required}>*</span>}
                            </label>
                            <input
                                type="password"
                                id="re_password"
                                name="re_password"
                                value={formData.re_password}
                                onChange={handleChange}
                                className={errors.re_password ? styles.error : ''}
                            />
                            {errors.re_password && (
                                <span className={styles.errorText}>{errors.re_password}</span>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className={styles.formGroup}>
                            <label htmlFor="phone_number">
                                <FontAwesomeIcon icon={faPhone} />
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className={errors.phone_number ? styles.error : ''}
                                placeholder="Nhập số điện thoại (10-11 chữ số)"
                            />
                            {errors.phone_number && (
                                <span className={styles.errorText}>{errors.phone_number}</span>
                            )}
                        </div>

                        {/* Gender */}
                        <div className={styles.formGroup}>
                            <label htmlFor="gender">
                                <FontAwesomeIcon icon={faVenusMars} />
                                Giới tính
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        {/* Role */}
                        <div className={styles.formGroup}>
                            <label htmlFor="role">
                                <FontAwesomeIcon icon={faUserTag} />
                                Vai trò <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={errors.role ? styles.error : ''}
                            >
                                <option value="">Chọn vai trò</option>
                                {roles.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <span className={styles.errorText}>{errors.role}</span>
                            )}
                        </div>

                        {/* Form Actions */}
                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : (mode === 'create' ? 'Tạo người dùng' : 'Cập nhật')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
