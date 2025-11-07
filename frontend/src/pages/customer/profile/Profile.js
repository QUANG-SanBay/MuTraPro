import { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import {
    ProfileHeader,
    ProfileAvatar,
    ProfileFormFields,
    ProfileActions
} from './components';
import { getProfile } from '~/api/userService';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Call API to update profile
        console.log('Updated profile:', formData);
        alert('Cập nhật thông tin thành công!');
        setIsEditing(false);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // TODO: Reset form data to original values
    };

    const handleChangePassword = () => {
        // TODO: Open change password modal
        alert('Chức năng đổi mật khẩu đang được phát triển');
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
                                onSubmit={handleSubmit}
                                onEdit={handleEdit}
                                onCancel={handleCancel}
                                onChangePassword={handleChangePassword}
                            />
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
