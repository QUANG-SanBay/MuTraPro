import { useState } from 'react';
import styles from './Profile.module.scss';
import {
    ProfileHeader,
    ProfileAvatar,
    ProfileFormFields,
    ProfileActions
} from './components';

function Profile() {
    const [formData, setFormData] = useState({
        fullName: 'Nguyễn Văn A',
        gender: 'male',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

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

                    <form  className={styles.form}>
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
                </div>
            </div>
        </div>
    );
}

export default Profile;
