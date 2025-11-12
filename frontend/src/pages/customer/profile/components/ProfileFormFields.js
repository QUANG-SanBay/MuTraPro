import styles from '../Profile.module.scss';

function ProfileFormFields({ formData, isEditing, onChange }) {
    return (
        <>
            {/* Full Name */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Họ và tên</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onChange}
                    disabled={!isEditing}
                    className={styles.input}
                    required
                />
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Giới tính</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={styles.radio}
                        />
                        <span>Nam</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={styles.radio}
                        />
                        <span>Nữ</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={formData.gender === 'other'}
                            onChange={onChange}
                            disabled={!isEditing}
                            className={styles.radio}
                        />
                        <span>Khác</span>
                    </label>
                </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    disabled={!isEditing}
                    className={styles.input}
                    required
                />
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Số điện thoại</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    disabled={!isEditing}
                    className={styles.input}
                    required
                />
            </div>

            {/* Address */}
            <div className={styles.formGroup}>
                <label className={styles.label}>Địa chỉ</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    disabled={!isEditing}
                    className={styles.input}
                    required
                />
            </div>
        </>
    );
}

export default ProfileFormFields;
