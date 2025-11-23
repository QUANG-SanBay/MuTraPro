import { useState, useEffect } from 'react';
import styles from './SystemSettings.module.scss';
import { 
    getSystemSettings, 
    updateSystemSettings, 
    getSettingsByCategory, 
    updateSettingsByCategory 
} from '~/api/adminService';

function SystemSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');

    // General settings
    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'MuTraPro',
        siteDescription: 'Hệ thống quản lý chuyển soạn nhạc chuyên nghiệp',
        contactEmail: 'contact@mutrapro.com',
        supportPhone: '1900-xxxx',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        maintenanceMode: false
    });

    // Email settings
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        fromEmail: 'noreply@mutrapro.com',
        fromName: 'MuTraPro System',
        enableEmailNotifications: true
    });

    // Payment settings
    const [paymentSettings, setPaymentSettings] = useState({
        vnpayEnabled: true,
        vnpayTmnCode: '',
        vnpayHashSecret: '',
        momoEnabled: false,
        momoPartnerCode: '',
        momoAccessKey: '',
        momoSecretKey: '',
        bankTransferEnabled: true,
        bankName: 'Vietcombank',
        bankAccountNumber: '',
        bankAccountName: ''
    });

    // Storage settings
    const [storageSettings, setStorageSettings] = useState({
        storageProvider: 'local',
        localStoragePath: '/media',
        maxFileSize: 100,
        allowedFileTypes: '.mp3,.wav,.flac,.pdf,.doc,.docx',
        s3Enabled: false,
        s3Bucket: '',
        s3Region: 'ap-southeast-1',
        s3AccessKey: '',
        s3SecretKey: ''
    });

    // Service settings
    const [serviceSettings, setServiceSettings] = useState({
        autoAssignTasks: true,
        taskTimeout: 24,
        allowCancellation: true,
        cancellationDeadline: 2,
        requireApproval: true,
        maxRevisions: 3,
        notifyOnStatusChange: true,
        notifyOnNewOrder: true
    });

    const tabs = [
        { id: 'general', label: 'Cài đặt chung', icon: '⚙️' },
        { id: 'email', label: 'Email', icon: '📧' },
        { id: 'payment', label: 'Thanh toán', icon: '💳' },
        { id: 'storage', label: 'Lưu trữ', icon: '💾' },
        { id: 'service', label: 'Dịch vụ', icon: '🔧' },
        { id: 'security', label: 'Bảo mật', icon: '🔒' }
    ];

    // Load settings when component mounts
    useEffect(() => {
        loadAllSettings();
    }, []);

    /**
     * Load all settings from backend
     */
    const loadAllSettings = async () => {
        setIsLoading(true);
        try {
            console.log('[SystemSettings] Loading all settings...');
            const response = await getSystemSettings();
            
            if (response && response.settings) {
                const { general, email, payment, storage, service } = response.settings;
                
                if (general) setGeneralSettings(general);
                if (email) setEmailSettings(email);
                if (payment) setPaymentSettings(payment);
                if (storage) setStorageSettings(storage);
                if (service) setServiceSettings(service);
                
                console.log('[SystemSettings] Settings loaded successfully');
            }
        } catch (error) {
            console.error('[SystemSettings] Error loading settings:', error);
            // Keep default values if API fails
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Load settings for specific category
     */
    const loadCategorySettings = async (category) => {
        try {
            console.log(`[SystemSettings] Loading ${category} settings...`);
            const response = await getSettingsByCategory(category);
            
            if (response && response.settings) {
                switch (category) {
                    case 'general':
                        setGeneralSettings(response.settings);
                        break;
                    case 'email':
                        setEmailSettings(response.settings);
                        break;
                    case 'payment':
                        setPaymentSettings(response.settings);
                        break;
                    case 'storage':
                        setStorageSettings(response.settings);
                        break;
                    case 'service':
                        setServiceSettings(response.settings);
                        break;
                }
                console.log(`[SystemSettings] ${category} settings loaded`);
            }
        } catch (error) {
            console.error(`[SystemSettings] Error loading ${category} settings:`, error);
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            console.log('[SystemSettings] Saving settings for tab:', activeTab);

            // Get current settings based on active tab
            let settingsToSave = {};
            switch (activeTab) {
                case 'general':
                    settingsToSave = generalSettings;
                    break;
                case 'email':
                    settingsToSave = emailSettings;
                    break;
                case 'payment':
                    settingsToSave = paymentSettings;
                    break;
                case 'storage':
                    settingsToSave = storageSettings;
                    break;
                case 'service':
                    settingsToSave = serviceSettings;
                    break;
                case 'security':
                    setSaveMessage('⚠️ Các tính năng bảo mật sẽ có trong phiên bản tiếp theo');
                    setIsSaving(false);
                    return;
            }

            // Validate required fields for general settings
            if (activeTab === 'general') {
                if (!generalSettings.siteName || generalSettings.siteName.trim() === '') {
                    setSaveMessage('❌ Tên hệ thống không được để trống');
                    setIsSaving(false);
                    return;
                }
                if (!generalSettings.contactEmail || generalSettings.contactEmail.trim() === '') {
                    setSaveMessage('❌ Email liên hệ không được để trống');
                    setIsSaving(false);
                    return;
                }
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(generalSettings.contactEmail)) {
                    setSaveMessage('❌ Email liên hệ không hợp lệ');
                    setIsSaving(false);
                    return;
                }
            }

            // Call API to update settings
            const response = await updateSettingsByCategory(activeTab, settingsToSave);

            console.log('[SystemSettings] Settings saved:', response);

            setSaveMessage('✅ Đã lưu cài đặt thành công!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('[SystemSettings] Error saving settings:', error);
            setSaveMessage(`❌ Có lỗi xảy ra khi lưu cài đặt: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    /**
     * Handle tab change
     */
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSaveMessage(''); // Clear any previous messages
    };

    const renderGeneralSettings = () => (
        <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Thông tin hệ thống</h3>
            
            <div className={styles.formGroup}>
                <label>Tên hệ thống</label>
                <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    placeholder="MuTraPro"
                />
            </div>

            <div className={styles.formGroup}>
                <label>Mô tả</label>
                <textarea
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    placeholder="Mô tả về hệ thống"
                    rows="3"
                />
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Email liên hệ</label>
                    <input
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                        placeholder="contact@mutrapro.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Số điện thoại hỗ trợ</label>
                    <input
                        type="text"
                        value={generalSettings.supportPhone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                        placeholder="1900-xxxx"
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Múi giờ</label>
                    <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (UTC+7)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                        <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Ngôn ngữ</label>
                    <select
                        value={generalSettings.language}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                    >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={generalSettings.maintenanceMode}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                    />
                    <span>Chế độ bảo trì</span>
                    <small>Khi bật, chỉ admin có thể truy cập hệ thống</small>
                </label>
            </div>
        </div>
    );

    const renderEmailSettings = () => (
        <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Cấu hình SMTP</h3>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>SMTP Host</label>
                    <input
                        type="text"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                        placeholder="smtp.gmail.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>SMTP Port</label>
                    <input
                        type="text"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                        placeholder="587"
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>SMTP Username</label>
                    <input
                        type="text"
                        value={emailSettings.smtpUser}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                        placeholder="your-email@gmail.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>SMTP Password</label>
                    <input
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <h3 className={styles.sectionTitle}>Email gửi đi</h3>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Email người gửi</label>
                    <input
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                        placeholder="noreply@mutrapro.com"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Tên người gửi</label>
                    <input
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                        placeholder="MuTraPro System"
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={emailSettings.enableEmailNotifications}
                        onChange={(e) => setEmailSettings({ ...emailSettings, enableEmailNotifications: e.target.checked })}
                    />
                    <span>Bật thông báo email</span>
                    <small>Gửi email thông báo cho người dùng khi có sự kiện quan trọng</small>
                </label>
            </div>
        </div>
    );

    const renderPaymentSettings = () => (
        <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>VNPay</h3>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={paymentSettings.vnpayEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, vnpayEnabled: e.target.checked })}
                    />
                    <span>Kích hoạt VNPay</span>
                </label>
            </div>

            {paymentSettings.vnpayEnabled && (
                <>
                    <div className={styles.formGroup}>
                        <label>TMN Code</label>
                        <input
                            type="text"
                            value={paymentSettings.vnpayTmnCode}
                            onChange={(e) => setPaymentSettings({ ...paymentSettings, vnpayTmnCode: e.target.value })}
                            placeholder="Mã TMN Code"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Hash Secret</label>
                        <input
                            type="password"
                            value={paymentSettings.vnpayHashSecret}
                            onChange={(e) => setPaymentSettings({ ...paymentSettings, vnpayHashSecret: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                </>
            )}

            <h3 className={styles.sectionTitle}>MoMo</h3>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={paymentSettings.momoEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, momoEnabled: e.target.checked })}
                    />
                    <span>Kích hoạt MoMo</span>
                </label>
            </div>

            {paymentSettings.momoEnabled && (
                <>
                    <div className={styles.formGroup}>
                        <label>Partner Code</label>
                        <input
                            type="text"
                            value={paymentSettings.momoPartnerCode}
                            onChange={(e) => setPaymentSettings({ ...paymentSettings, momoPartnerCode: e.target.value })}
                            placeholder="Mã đối tác MoMo"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Access Key</label>
                            <input
                                type="text"
                                value={paymentSettings.momoAccessKey}
                                onChange={(e) => setPaymentSettings({ ...paymentSettings, momoAccessKey: e.target.value })}
                                placeholder="Access Key"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Secret Key</label>
                            <input
                                type="password"
                                value={paymentSettings.momoSecretKey}
                                onChange={(e) => setPaymentSettings({ ...paymentSettings, momoSecretKey: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </>
            )}

            <h3 className={styles.sectionTitle}>Chuyển khoản ngân hàng</h3>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={paymentSettings.bankTransferEnabled}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankTransferEnabled: e.target.checked })}
                    />
                    <span>Kích hoạt chuyển khoản ngân hàng</span>
                </label>
            </div>

            {paymentSettings.bankTransferEnabled && (
                <>
                    <div className={styles.formGroup}>
                        <label>Tên ngân hàng</label>
                        <input
                            type="text"
                            value={paymentSettings.bankName}
                            onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                            placeholder="Vietcombank"
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Số tài khoản</label>
                            <input
                                type="text"
                                value={paymentSettings.bankAccountNumber}
                                onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccountNumber: e.target.value })}
                                placeholder="0123456789"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Chủ tài khoản</label>
                            <input
                                type="text"
                                value={paymentSettings.bankAccountName}
                                onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccountName: e.target.value })}
                                placeholder="CONG TY MUTRAPRO"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderStorageSettings = () => (
        <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Cấu hình lưu trữ</h3>

            <div className={styles.formGroup}>
                <label>Nhà cung cấp lưu trữ</label>
                <select
                    value={storageSettings.storageProvider}
                    onChange={(e) => setStorageSettings({ ...storageSettings, storageProvider: e.target.value })}
                >
                    <option value="local">Local Storage (Lưu trữ cục bộ)</option>
                    <option value="s3">Amazon S3</option>
                    <option value="azure">Azure Blob Storage</option>
                </select>
            </div>

            {storageSettings.storageProvider === 'local' && (
                <div className={styles.formGroup}>
                    <label>Đường dẫn lưu trữ</label>
                    <input
                        type="text"
                        value={storageSettings.localStoragePath}
                        onChange={(e) => setStorageSettings({ ...storageSettings, localStoragePath: e.target.value })}
                        placeholder="/media"
                    />
                </div>
            )}

            {storageSettings.storageProvider === 's3' && (
                <>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>S3 Bucket</label>
                            <input
                                type="text"
                                value={storageSettings.s3Bucket}
                                onChange={(e) => setStorageSettings({ ...storageSettings, s3Bucket: e.target.value })}
                                placeholder="my-bucket-name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Region</label>
                            <input
                                type="text"
                                value={storageSettings.s3Region}
                                onChange={(e) => setStorageSettings({ ...storageSettings, s3Region: e.target.value })}
                                placeholder="ap-southeast-1"
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Access Key</label>
                            <input
                                type="text"
                                value={storageSettings.s3AccessKey}
                                onChange={(e) => setStorageSettings({ ...storageSettings, s3AccessKey: e.target.value })}
                                placeholder="AWS Access Key"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Secret Key</label>
                            <input
                                type="password"
                                value={storageSettings.s3SecretKey}
                                onChange={(e) => setStorageSettings({ ...storageSettings, s3SecretKey: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </>
            )}

            <h3 className={styles.sectionTitle}>Giới hạn tệp tin</h3>

            <div className={styles.formGroup}>
                <label>Kích thước tệp tối đa (MB)</label>
                <input
                    type="number"
                    value={storageSettings.maxFileSize}
                    onChange={(e) => setStorageSettings({ ...storageSettings, maxFileSize: parseInt(e.target.value) })}
                    min="1"
                    max="500"
                />
            </div>

            <div className={styles.formGroup}>
                <label>Loại tệp cho phép</label>
                <input
                    type="text"
                    value={storageSettings.allowedFileTypes}
                    onChange={(e) => setStorageSettings({ ...storageSettings, allowedFileTypes: e.target.value })}
                    placeholder=".mp3,.wav,.flac,.pdf"
                />
                <small>Phân tách bằng dấu phẩy, ví dụ: .mp3,.wav,.flac</small>
            </div>
        </div>
    );

    const renderServiceSettings = () => (
        <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Quản lý công việc</h3>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={serviceSettings.autoAssignTasks}
                        onChange={(e) => setServiceSettings({ ...serviceSettings, autoAssignTasks: e.target.checked })}
                    />
                    <span>Tự động phân công công việc</span>
                    <small>Tự động gán nhiệm vụ cho chuyên viên phù hợp</small>
                </label>
            </div>

            <div className={styles.formGroup}>
                <label>Thời gian timeout công việc (giờ)</label>
                <input
                    type="number"
                    value={serviceSettings.taskTimeout}
                    onChange={(e) => setServiceSettings({ ...serviceSettings, taskTimeout: parseInt(e.target.value) })}
                    min="1"
                    max="168"
                />
                <small>Thời gian tối đa để hoàn thành một công việc</small>
            </div>

            <h3 className={styles.sectionTitle}>Đơn hàng</h3>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={serviceSettings.allowCancellation}
                        onChange={(e) => setServiceSettings({ ...serviceSettings, allowCancellation: e.target.checked })}
                    />
                    <span>Cho phép hủy đơn hàng</span>
                </label>
            </div>

            {serviceSettings.allowCancellation && (
                <div className={styles.formGroup}>
                    <label>Thời hạn hủy đơn (giờ)</label>
                    <input
                        type="number"
                        value={serviceSettings.cancellationDeadline}
                        onChange={(e) => setServiceSettings({ ...serviceSettings, cancellationDeadline: parseInt(e.target.value) })}
                        min="1"
                        max="72"
                    />
                    <small>Khách hàng có thể hủy đơn trong vòng X giờ sau khi đặt</small>
                </div>
            )}

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={serviceSettings.requireApproval}
                        onChange={(e) => setServiceSettings({ ...serviceSettings, requireApproval: e.target.checked })}
                    />
                    <span>Yêu cầu phê duyệt sản phẩm</span>
                    <small>Khách hàng cần phê duyệt trước khi hoàn tất đơn hàng</small>
                </label>
            </div>

            <div className={styles.formGroup}>
                <label>Số lần sửa đổi tối đa</label>
                <input
                    type="number"
                    value={serviceSettings.maxRevisions}
                    onChange={(e) => setServiceSettings({ ...serviceSettings, maxRevisions: parseInt(e.target.value) })}
                    min="0"
                    max="10"
                />
                <small>Số lần khách hàng có thể yêu cầu chỉnh sửa</small>
            </div>

            <h3 className={styles.sectionTitle}>Thông báo</h3>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={serviceSettings.notifyOnStatusChange}
                        onChange={(e) => setServiceSettings({ ...serviceSettings, notifyOnStatusChange: e.target.checked })}
                    />
                    <span>Thông báo khi thay đổi trạng thái</span>
                </label>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                    <input
                        type="checkbox"
                        checked={serviceSettings.notifyOnNewOrder}
                        onChange={(e) => setServiceSettings({ ...serviceSettings, notifyOnNewOrder: e.target.checked })}
                    />
                    <span>Thông báo khi có đơn hàng mới</span>
                </label>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Bảo mật hệ thống</h3>

            <div className={styles.infoBox}>
                <p>🔒 <strong>Cài đặt bảo mật nâng cao</strong></p>
                <p>Các tính năng bảo mật sẽ được phát triển trong phiên bản tiếp theo:</p>
                <ul>
                    <li>Xác thực hai yếu tố (2FA)</li>
                    <li>Chính sách mật khẩu</li>
                    <li>IP whitelist/blacklist</li>
                    <li>Session timeout</li>
                    <li>Audit logs</li>
                </ul>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralSettings();
            case 'email':
                return renderEmailSettings();
            case 'payment':
                return renderPaymentSettings();
            case 'storage':
                return renderStorageSettings();
            case 'service':
                return renderServiceSettings();
            case 'security':
                return renderSecuritySettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div className={styles.systemSettings}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Cài đặt hệ thống</h1>
                    <p className={styles.subtitle}>Quản lý các cấu hình và thông số của hệ thống</p>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Đang tải cài đặt...</p>
                    </div>
                ) : (
                    <div className={styles.settingsLayout}>
                        {/* Sidebar Tabs */}
                        <div className={styles.sidebar}>
                            <div className={styles.tabList}>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                                        onClick={() => handleTabChange(tab.id)}
                                    >
                                        <span className={styles.tabIcon}>{tab.icon}</span>
                                        <span className={styles.tabLabel}>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className={styles.content}>
                            {renderTabContent()}

                            {/* Save Button */}
                            <div className={styles.actionBar}>
                                {saveMessage && (
                                    <div className={`${styles.saveMessage} ${saveMessage.includes('❌') ? styles.error : saveMessage.includes('⚠️') ? styles.warning : styles.success}`}>
                                        {saveMessage}
                                    </div>
                                )}
                                <button
                                    className={styles.saveButton}
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                >
                                    {isSaving ? '⏳ Đang lưu...' : '💾 Lưu cài đặt'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SystemSettings;
