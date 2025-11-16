import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserShield,
    faSync,
    faSearch,
    faChevronRight,
    faChevronLeft,
    faCheckCircle,
    faTimesCircle,
    faSave,
    faUserTag
} from '@fortawesome/free-solid-svg-icons';
import styles from './RolePermissionManagement.module.scss';

const RolePermissionManagement = () => {
    // Define roles that can be managed (excluding admin)
    const managedRoles = [
        { value: 'customer', label: 'Khách hàng', color: 'blue' },
        { value: 'service_coordinator', label: 'Điều phối viên', color: 'yellow' },
        { value: 'transcription_specialist', label: 'Chuyên gia phiên âm', color: 'green' },
        { value: 'arrangement_specialist', label: 'Chuyên gia hòa âm', color: 'purple' },
        { value: 'recording_artist', label: 'Nghệ sĩ thu âm', color: 'pink' },
        { value: 'studio_administrator', label: 'Quản trị viên studio', color: 'gray' }
    ];

    // Define all available permissions
    const allPermissions = [
        // User & Profile permissions
        { codename: 'view_own_profile', name: 'Xem hồ sơ cá nhân', category: 'Tài khoản | Hồ sơ' },
        { codename: 'edit_own_profile', name: 'Chỉnh sửa hồ sơ cá nhân', category: 'Tài khoản | Hồ sơ' },
        { codename: 'change_password', name: 'Đổi mật khẩu', category: 'Tài khoản | Bảo mật' },
        { codename: 'view_all_users', name: 'Xem tất cả người dùng', category: 'Tài khoản | Người dùng' },
        { codename: 'manage_users', name: 'Quản lý người dùng', category: 'Tài khoản | Người dùng' },

        // Order permissions
        { codename: 'create_order', name: 'Tạo đơn hàng', category: 'Đơn hàng | Quản lý' },
        { codename: 'view_own_orders', name: 'Xem đơn hàng của mình', category: 'Đơn hàng | Xem' },
        { codename: 'view_all_orders', name: 'Xem tất cả đơn hàng', category: 'Đơn hàng | Xem' },
        { codename: 'edit_order', name: 'Chỉnh sửa đơn hàng', category: 'Đơn hàng | Quản lý' },
        { codename: 'cancel_order', name: 'Hủy đơn hàng', category: 'Đơn hàng | Quản lý' },
        { codename: 'approve_order', name: 'Phê duyệt đơn hàng', category: 'Đơn hàng | Phê duyệt' },
        { codename: 'reject_order', name: 'Từ chối đơn hàng', category: 'Đơn hàng | Phê duyệt' },
        { codename: 'assign_order', name: 'Phân công đơn hàng cho chuyên gia', category: 'Đơn hàng | Phân công' },
        { codename: 'track_order', name: 'Theo dõi tiến độ đơn hàng', category: 'Đơn hàng | Theo dõi' },

        // Payment permissions
        { codename: 'create_payment', name: 'Tạo thanh toán', category: 'Thanh toán | Quản lý' },
        { codename: 'view_own_payments', name: 'Xem thanh toán của mình', category: 'Thanh toán | Xem' },
        { codename: 'view_all_payments', name: 'Xem tất cả thanh toán', category: 'Thanh toán | Xem' },
        { codename: 'process_payment', name: 'Xử lý thanh toán', category: 'Thanh toán | Xử lý' },
        { codename: 'refund_payment', name: 'Hoàn tiền', category: 'Thanh toán | Xử lý' },

        // Media permissions
        { codename: 'upload_media', name: 'Tải lên file media', category: 'Media | Upload' },
        { codename: 'view_own_media', name: 'Xem media của mình', category: 'Media | Xem' },
        { codename: 'view_all_media', name: 'Xem tất cả media', category: 'Media | Xem' },
        { codename: 'download_media', name: 'Tải xuống media', category: 'Media | Download' },
        { codename: 'delete_media', name: 'Xóa media', category: 'Media | Quản lý' },
        { codename: 'edit_media', name: 'Chỉnh sửa media', category: 'Media | Quản lý' },

        // Studio permissions
        { codename: 'view_studio', name: 'Xem thông tin studio', category: 'Studio | Xem' },
        { codename: 'manage_studio', name: 'Quản lý studio', category: 'Studio | Quản lý' },
        { codename: 'manage_studio_equipment', name: 'Quản lý thiết bị studio', category: 'Studio | Thiết bị' },
        { codename: 'manage_studio_schedule', name: 'Quản lý lịch studio', category: 'Studio | Lịch trình' },
        { codename: 'book_studio', name: 'Đặt lịch studio', category: 'Studio | Đặt lịch' },

        // Task permissions
        { codename: 'view_assigned_tasks', name: 'Xem nhiệm vụ được giao', category: 'Nhiệm vụ | Xem' },
        { codename: 'view_all_tasks', name: 'Xem tất cả nhiệm vụ', category: 'Nhiệm vụ | Xem' },
        { codename: 'update_task_status', name: 'Cập nhật trạng thái nhiệm vụ', category: 'Nhiệm vụ | Cập nhật' },
        { codename: 'assign_task', name: 'Phân công nhiệm vụ', category: 'Nhiệm vụ | Phân công' },
        { codename: 'complete_task', name: 'Hoàn thành nhiệm vụ', category: 'Nhiệm vụ | Cập nhật' },

        // Notification permissions
        { codename: 'view_notifications', name: 'Xem thông báo', category: 'Thông báo | Xem' },
        { codename: 'send_notification', name: 'Gửi thông báo', category: 'Thông báo | Gửi' },
        { codename: 'mark_notification_read', name: 'Đánh dấu đã đọc', category: 'Thông báo | Quản lý' },

        // Report permissions
        { codename: 'view_reports', name: 'Xem báo cáo', category: 'Báo cáo | Xem' },
        { codename: 'generate_reports', name: 'Tạo báo cáo', category: 'Báo cáo | Tạo' },
        { codename: 'export_reports', name: 'Xuất báo cáo', category: 'Báo cáo | Xuất' },
        { codename: 'view_statistics', name: 'Xem thống kê', category: 'Báo cáo | Thống kê' }
    ];

    // Default permissions for each role
    const defaultRolePermissions = {
        customer: [
            'view_own_profile', 'edit_own_profile', 'change_password',
            'create_order', 'view_own_orders', 'cancel_order', 'track_order',
            'create_payment', 'view_own_payments',
            'upload_media', 'view_own_media', 'download_media',
            'view_studio', 'book_studio',
            'view_notifications', 'mark_notification_read'
        ],
        service_coordinator: [
            'view_own_profile', 'edit_own_profile', 'change_password',
            'view_all_users', 'view_all_orders', 'edit_order', 'approve_order', 'reject_order', 'assign_order', 'track_order',
            'view_all_payments', 'process_payment',
            'view_all_media', 'download_media',
            'view_studio', 'manage_studio_schedule',
            'view_all_tasks', 'assign_task',
            'view_notifications', 'send_notification', 'mark_notification_read',
            'view_reports', 'generate_reports', 'view_statistics'
        ],
        transcription_specialist: [
            'view_own_profile', 'edit_own_profile', 'change_password',
            'view_own_orders', 'track_order',
            'upload_media', 'view_own_media', 'download_media', 'edit_media',
            'view_studio',
            'view_assigned_tasks', 'update_task_status', 'complete_task',
            'view_notifications', 'mark_notification_read'
        ],
        arrangement_specialist: [
            'view_own_profile', 'edit_own_profile', 'change_password',
            'view_own_orders', 'track_order',
            'upload_media', 'view_own_media', 'download_media', 'edit_media',
            'view_studio',
            'view_assigned_tasks', 'update_task_status', 'complete_task',
            'view_notifications', 'mark_notification_read'
        ],
        recording_artist: [
            'view_own_profile', 'edit_own_profile', 'change_password',
            'view_own_orders', 'track_order',
            'upload_media', 'view_own_media', 'download_media',
            'view_studio', 'book_studio',
            'view_assigned_tasks', 'update_task_status', 'complete_task',
            'view_notifications', 'mark_notification_read'
        ],
        studio_administrator: [
            'view_own_profile', 'edit_own_profile', 'change_password',
            'view_all_orders', 'track_order',
            'view_all_payments',
            'view_all_media', 'download_media',
            'view_studio', 'manage_studio', 'manage_studio_equipment', 'manage_studio_schedule',
            'view_all_tasks',
            'view_notifications', 'send_notification', 'mark_notification_read',
            'view_reports', 'generate_reports', 'view_statistics'
        ]
    };

    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

    // Permission lists for current role
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [chosenPermissions, setChosenPermissions] = useState([]);

    // Filter states
    const [availableFilter, setAvailableFilter] = useState('');
    const [chosenFilter, setChosenFilter] = useState('');

    // Selected permissions for moving
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedChosen, setSelectedChosen] = useState([]);

    /**
     * Initialize role permissions from defaults
     */
    useEffect(() => {
        setRolePermissions(defaultRolePermissions);
    }, []);

    /**
     * Handle role selection
     */
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setAlert(null);

        const rolePerms = rolePermissions[role.value] || [];

        // Split permissions into available and chosen
        const chosen = allPermissions.filter(p => rolePerms.includes(p.codename));
        const available = allPermissions.filter(p => !rolePerms.includes(p.codename));

        setChosenPermissions(chosen);
        setAvailablePermissions(available);
        setSelectedAvailable([]);
        setSelectedChosen([]);
    };

    /**
     * Handle move permissions to chosen
     */
    const handleChoose = () => {
        if (selectedAvailable.length === 0) return;

        const toMove = availablePermissions.filter(p =>
            selectedAvailable.includes(p.codename)
        );

        setChosenPermissions([...chosenPermissions, ...toMove]);
        setAvailablePermissions(availablePermissions.filter(p =>
            !selectedAvailable.includes(p.codename)
        ));
        setSelectedAvailable([]);
    };

    /**
     * Handle move permissions to available
     */
    const handleRemove = () => {
        if (selectedChosen.length === 0) return;

        const toMove = chosenPermissions.filter(p =>
            selectedChosen.includes(p.codename)
        );

        setAvailablePermissions([...availablePermissions, ...toMove]);
        setChosenPermissions(chosenPermissions.filter(p =>
            !selectedChosen.includes(p.codename)
        ));
        setSelectedChosen([]);
    };

    /**
     * Handle choose all
     */
    const handleChooseAll = () => {
        const filtered = getFilteredAvailable();
        setChosenPermissions([...chosenPermissions, ...filtered]);
        setAvailablePermissions(availablePermissions.filter(p =>
            !filtered.some(fp => fp.codename === p.codename)
        ));
        setSelectedAvailable([]);
    };

    /**
     * Handle remove all
     */
    const handleRemoveAll = () => {
        const filtered = getFilteredChosen();
        setAvailablePermissions([...availablePermissions, ...filtered]);
        setChosenPermissions(chosenPermissions.filter(p =>
            !filtered.some(fp => fp.codename === p.codename)
        ));
        setSelectedChosen([]);
    };

    /**
     * Handle save permissions
     */
    const handleSave = async () => {
        if (!selectedRole) return;

        setSaving(true);
        setAlert(null);

        try {
            // Update local state
            const permissionCodenames = chosenPermissions.map(p => p.codename);
            setRolePermissions({
                ...rolePermissions,
                [selectedRole.value]: permissionCodenames
            });

            // TODO: Call API to save to backend
            // await updateRolePermissions(selectedRole.value, permissionCodenames);

            setAlert({
                type: 'success',
                message: `Cập nhật quyền cho vai trò "${selectedRole.label}" thành công!`
            });

            // Auto hide alert after 3 seconds
            setTimeout(() => setAlert(null), 3000);
        } catch (err) {
            console.error('Error updating permissions:', err);
            setAlert({
                type: 'error',
                message: 'Có lỗi xảy ra khi cập nhật quyền.'
            });
        } finally {
            setSaving(false);
        }
    };

    /**
     * Handle reset to default
     */
    const handleResetToDefault = () => {
        if (!selectedRole) return;

        const defaultPerms = defaultRolePermissions[selectedRole.value] || [];
        const chosen = allPermissions.filter(p => defaultPerms.includes(p.codename));
        const available = allPermissions.filter(p => !defaultPerms.includes(p.codename));

        setChosenPermissions(chosen);
        setAvailablePermissions(available);
        setSelectedAvailable([]);
        setSelectedChosen([]);

        setAlert({
            type: 'success',
            message: 'Đã khôi phục quyền mặc định!'
        });

        setTimeout(() => setAlert(null), 3000);
    };

    /**
     * Get filtered available permissions
     */
    const getFilteredAvailable = () => {
        if (!availableFilter) return availablePermissions;

        const filter = availableFilter.toLowerCase();
        return availablePermissions.filter(p =>
            p.name.toLowerCase().includes(filter) ||
            p.category.toLowerCase().includes(filter)
        );
    };

    /**
     * Get filtered chosen permissions
     */
    const getFilteredChosen = () => {
        if (!chosenFilter) return chosenPermissions;

        const filter = chosenFilter.toLowerCase();
        return chosenPermissions.filter(p =>
            p.name.toLowerCase().includes(filter) ||
            p.category.toLowerCase().includes(filter)
        );
    };

    /**
     * Handle toggle select available permission
     */
    const handleToggleAvailable = (codename) => {
        setSelectedAvailable(prev =>
            prev.includes(codename)
                ? prev.filter(c => c !== codename)
                : [...prev, codename]
        );
    };

    /**
     * Handle toggle select chosen permission
     */
    const handleToggleChosen = (codename) => {
        setSelectedChosen(prev =>
            prev.includes(codename)
                ? prev.filter(c => c !== codename)
                : [...prev, codename]
        );
    };

    return (
        <div className={styles.rolePermissionManagement}>
            <div className={styles.container}>

                {/* Page Header */}
                <div className={styles.pageHeader}>
                    <div className={styles.headerLeft}>
                        <FontAwesomeIcon icon={faUserShield} />
                        <h1>Quản lý Phân quyền theo Vai trò</h1>
                    </div>
                    <button
                        className={styles.refreshButton}
                        onClick={handleResetToDefault}
                        disabled={!selectedRole || saving}
                    >
                        <FontAwesomeIcon icon={faSync} />
                        Khôi phục mặc định
                    </button>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`${styles.alert} ${styles[alert.type]}`}>
                        <FontAwesomeIcon icon={alert.type === 'success' ? faCheckCircle : faTimesCircle} />
                        <span>{alert.message}</span>
                    </div>
                )}

                <div className={styles.content}>
                    {/* Role Selection */}
                    <div className={styles.roleSelection}>
                        <h2>
                            <FontAwesomeIcon icon={faUserTag} />
                            Chọn vai trò để quản lý quyền:
                        </h2>
                        <div className={styles.roleGrid}>
                            {managedRoles.map(role => (
                                <div
                                    key={role.value}
                                    className={`${styles.roleCard} ${styles[role.color]} ${selectedRole?.value === role.value ? styles.selected : ''
                                        }`}
                                    onClick={() => handleRoleSelect(role)}
                                >
                                    <FontAwesomeIcon icon={faUserTag} />
                                    <span>{role.label}</span>
                                    <div className={styles.permCount}>
                                        {rolePermissions[role.value]?.length || 0} quyền
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permission Management */}
                    {selectedRole && (
                        <div className={styles.permissionManagementSection}>
                            <div className={styles.sectionTitle}>
                                <h3>Quyền truy cập cho vai trò: <strong>{selectedRole.label}</strong></h3>
                                <p>Chọn các quyền và sử dụng nút mũi tên để di chuyển giữa 2 danh sách</p>
                            </div>

                            <div className={styles.permissionsContainer}>
                                {/* Available Permissions */}
                                <div className={styles.permissionBox}>
                                    <div className={styles.boxHeader}>
                                        <h3>Quyền có sẵn</h3>
                                        <p>Chọn quyền và nhấn nút "Thêm" để gán cho vai trò</p>
                                    </div>

                                    <div className={styles.filterBox}>
                                        <FontAwesomeIcon icon={faSearch} />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm quyền..."
                                            value={availableFilter}
                                            onChange={(e) => setAvailableFilter(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.permissionList}>
                                        {getFilteredAvailable().map(permission => (
                                            <div
                                                key={permission.codename}
                                                className={`${styles.permissionItem} ${selectedAvailable.includes(permission.codename) ? styles.selected : ''
                                                    }`}
                                                onClick={() => handleToggleAvailable(permission.codename)}
                                            >
                                                <span className={styles.category}>{permission.category}</span>
                                                <span className={styles.name}>{permission.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.boxFooter}>
                                        {getFilteredAvailable().length} / {availablePermissions.length} quyền
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={styles.actionButtons}>
                                    <button
                                        onClick={handleChooseAll}
                                        disabled={availablePermissions.length === 0}
                                        title="Thêm tất cả"
                                        className={styles.btnAll}
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                    <button
                                        onClick={handleChoose}
                                        disabled={selectedAvailable.length === 0}
                                        title="Thêm đã chọn"
                                        className={styles.btnSingle}
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                    <button
                                        onClick={handleRemove}
                                        disabled={selectedChosen.length === 0}
                                        title="Xóa đã chọn"
                                        className={styles.btnSingle}
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <button
                                        onClick={handleRemoveAll}
                                        disabled={chosenPermissions.length === 0}
                                        title="Xóa tất cả"
                                        className={styles.btnAll}
                                    >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                </div>

                                {/* Chosen Permissions */}
                                <div className={styles.permissionBox}>
                                    <div className={styles.boxHeader}>
                                        <h3>Quyền đã gán</h3>
                                        <p>Chọn quyền và nhấn nút "Xóa" để loại bỏ khỏi vai trò</p>
                                    </div>

                                    <div className={styles.filterBox}>
                                        <FontAwesomeIcon icon={faSearch} />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm quyền..."
                                            value={chosenFilter}
                                            onChange={(e) => setChosenFilter(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.permissionList}>
                                        {getFilteredChosen().map(permission => (
                                            <div
                                                key={permission.codename}
                                                className={`${styles.permissionItem} ${selectedChosen.includes(permission.codename) ? styles.selected : ''
                                                    }`}
                                                onClick={() => handleToggleChosen(permission.codename)}
                                            >
                                                <span className={styles.category}>{permission.category}</span>
                                                <span className={styles.name}>{permission.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.boxFooter}>
                                        {getFilteredChosen().length} / {chosenPermissions.length} quyền
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className={styles.saveSection}>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={styles.saveButton}
                                >
                                    <FontAwesomeIcon icon={faSave} />
                                    {saving ? 'Đang lưu...' : 'Lưu cấu hình quyền'}
                                </button>
                            </div>
                        </div>
                    )}

                    {!selectedRole && (
                        <div className={styles.noRoleSelected}>
                            <FontAwesomeIcon icon={faUserShield} />
                            <p>Vui lòng chọn vai trò để quản lý quyền truy cập</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolePermissionManagement;
