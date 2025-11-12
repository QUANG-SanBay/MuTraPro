import styles from './RecentActivity.module.scss';

function RecentActivity({ activities = [] }) {
    const getActivityIcon = (type) => {
        switch(type) {
            case 'user_registered':
                return '👤';
            case 'order_created':
                return '📦';
            case 'payment_completed':
                return '💰';
            case 'role_changed':
                return '🔐';
            default:
                return '📌';
        }
    };

    const getActivityColor = (type) => {
        switch(type) {
            case 'user_registered':
                return 'blue';
            case 'order_created':
                return 'green';
            case 'payment_completed':
                return 'orange';
            case 'role_changed':
                return 'purple';
            default:
                return 'gray';
        }
    };

    return (
        <div className={styles.recentActivity}>
            <div className={styles.header}>
                <h2 className={styles.title}>Hoạt động gần đây</h2>
                <button className={styles.viewAll}>Xem tất cả</button>
            </div>
            <div className={styles.activityList}>
                {activities.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Chưa có hoạt động nào</p>
                    </div>
                ) : (
                    activities.map((activity, index) => (
                        <div key={index} className={styles.activityItem}>
                            <div className={`${styles.icon} ${styles[getActivityColor(activity.type)]}`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className={styles.content}>
                                <p className={styles.description}>{activity.description}</p>
                                <span className={styles.time}>{activity.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RecentActivity;
