import styles from './SystemStatus.module.scss';

function SystemStatus({ status = {} }) {
    const defaultStatus = {
        server: 'online',
        database: 'online',
        api: 'online',
        storage: 'online',
        ...status
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'online':
                return 'green';
            case 'warning':
                return 'orange';
            case 'offline':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'online':
                return 'Hoạt động tốt';
            case 'warning':
                return 'Cảnh báo';
            case 'offline':
                return 'Ngưng hoạt động';
            default:
                return 'Không rõ';
        }
    };

    const statusItems = [
        { label: 'Server', key: 'server', icon: '🖥️' },
        { label: 'Database', key: 'database', icon: '💾' },
        { label: 'API Gateway', key: 'api', icon: '🔌' },
        { label: 'Storage', key: 'storage', icon: '📦' },
        { label: 'WebSocket', key: 'websocket', icon: '🔄' }
    ];

    return (
        <div className={styles.systemStatus}>
            <div className={styles.header}>
                <h2 className={styles.title}>Trạng thái hệ thống</h2>
                <span className={styles.lastUpdate}>Cập nhật: 2 phút trước</span>
            </div>
            <div className={styles.statusGrid}>
                {statusItems.map((item) => (
                    <div key={item.key} className={styles.statusItem}>
                        <div className={styles.itemHeader}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </div>
                        <div className={styles.itemStatus}>
                            <span className={`${styles.indicator} ${styles[getStatusColor(defaultStatus[item.key])]}`}></span>
                            <span className={styles.statusText}>
                                {getStatusText(defaultStatus[item.key])}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SystemStatus;
