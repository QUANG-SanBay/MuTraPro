import { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import {
    ProfileHeader,
    ProfileAvatar,
    ProfileFormFields,
    ProfileActions
} from './components';
import { getProfile, updateProfile, changePassword } from '~/api/userService';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '~/components/ChangePasswordModal/ChangePasswordModal';

function Profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        email: '',
        phone: '',
        address: ''
    });
    const [originalData, setOriginalData] = useState(null); // Store original data for cancel
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    
    // Change password modal state
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await getProfile();
                
                // Map API response to form data
                setFormData({
                    fullName: response.user.full_name || '',
                    gender: response.user.gender || 'male',
                    email: response.user.email || '',
                    phone: response.user.phone_number || '',
                    address: '' // Address might need to be fetched from profile table
                });
                
                // Store original data for cancel
                setOriginalData({
                    fullName: response.user.full_name || '',
                    gender: response.user.gender || '',
                    email: response.user.email || '',
                    phone: response.user.phone_number || '',
                    address: ''
                });
                
                setError(null);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
                
                // If unauthorized, redirect to login
                if (err.status === 401) {
                    navigate('/auth');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccessMessage('');

        try {
            const response = await updateProfile({
                full_name: formData.fullName,
                phone_number: formData.phone,
                gender: formData.gender
            });

            // Update form data with response
            const updatedData = {
                fullName: response.user.full_name || '',
                gender: response.user.gender || '',
                email: response.user.email || '',
                phone: response.user.phone_number || '',
                address: formData.address
            };

            setFormData(updatedData);
            setOriginalData(updatedData);
            setSuccessMessage('Cập nhật thông tin thành công!');
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            
            if (err.status === 400 && err.data) {
                // Handle validation errors from backend
                const errorMessages = [];
                if (err.data.phone_number) {
                    errorMessages.push(`Số điện thoại: ${err.data.phone_number[0]}`);
                }
                if (err.data.full_name) {
                    errorMessages.push(`Họ và tên: ${err.data.full_name[0]}`);
                }
                if (err.data.gender) {
                    errorMessages.push(`Giới tính: ${err.data.gender[0]}`);
                }
                setError(errorMessages.length > 0 ? errorMessages.join('. ') : 'Dữ liệu không hợp lệ.');
            } else if (err.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/auth'), 2000);
            } else {
                setError('Cập nhật thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
        setSuccessMessage('');
        // Reset form data to original values
        if (originalData) {
            setFormData(originalData);
        }
    };

    const handleChangePassword = () => {
        setIsChangePasswordModalOpen(true);
        setPasswordError(null);
    };

    const handlePasswordSubmit = async (passwordData) => {
        setIsChangingPassword(true);
        setPasswordError(null);

        try {
            await changePassword({
                old_password: passwordData.oldPassword,
                new_password: passwordData.newPassword,
                confirm_password: passwordData.confirmPassword
            });

            // Success - close modal and show success message
            setIsChangePasswordModalOpen(false);
            setSuccessMessage('Đổi mật khẩu thành công!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error changing password:', err);
            
            if (err.status === 400 && err.data?.errors) {
                // Handle validation errors from backend
                const errors = err.data.errors;
                const errorMessages = [];
                
                if (errors.old_password) {
                    errorMessages.push(errors.old_password[0]);
                }
                if (errors.new_password) {
                    errorMessages.push(errors.new_password[0]);
                }
                if (errors.confirm_password) {
                    errorMessages.push(errors.confirm_password[0]);
                }
                
                setPasswordError(errorMessages.length > 0 ? errorMessages.join('. ') : 'Dữ liệu không hợp lệ.');
            } else if (err.status === 401) {
                setPasswordError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    setIsChangePasswordModalOpen(false);
                    navigate('/auth');
                }, 2000);
            } else {
                setPasswordError('Đổi mật khẩu thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <ProfileHeader />

                    {isLoading ? (
                        <div className={styles.loading}>
                            <p>Đang tải thông tin...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.error}>
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()}>
                                Thử lại
                            </button>
                        </div>
                    ) : (
                        <>
                            {successMessage && (
                                <div className={styles.successMessage}>
                                    {successMessage}
                                </div>
                            )}
                            
                            <form className={styles.form}>
                                <ProfileAvatar
                                    avatarPreview={avatarPreview}
                                    isEditing={isEditing}
                                    onAvatarChange={handleAvatarChange}
                                />

                                <ProfileFormFields
                                    formData={formData}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />

                                <ProfileActions
                                    isEditing={isEditing}
                                    isSaving={isSaving}
                                    onSubmit={handleSubmit}
                                    onEdit={handleEdit}
                                    onCancel={handleCancel}
                                    onChangePassword={handleChangePassword}
                                />
                            </form>
                        </>
                    )}
                </div>
            </div>
            
            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => {
                    setIsChangePasswordModalOpen(false);
                    setPasswordError(null);
                }}
                onSubmit={handlePasswordSubmit}
                isLoading={isChangingPassword}
                error={passwordError}
            />
        </div>
    );
}

export default Profile;
