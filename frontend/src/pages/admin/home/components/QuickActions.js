import styles from './QuickActions.module.scss';
import { useNavigate } from 'react-router-dom';

function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            icon: '👥',
            title: 'Quản lý người dùng',
            description: 'Xem và quản lý tài khoản',
            path: '/admin/users',
            color: 'blue'
        },
        {
            icon: '🔐',
            title: 'Phân quyền',
            description: 'Cấu hình vai trò & quyền',
            path: '/admin/permissions',
            color: 'purple'
        },
        {
            icon: '📊',
            title: 'Báo cáo',
            description: 'Xem thống kê & báo cáo',
            path: '/admin/reports',
            color: 'green'
        },
        {
            icon: '⚙️',
            title: 'Cấu hình',
            description: 'Cài đặt hệ thống',
            path: '/admin/settings',
            color: 'orange'
        }
    ];

    return (
        <div className={styles.quickActions}>
            <h2 className={styles.title}>Truy cập nhanh</h2>
            <div className={styles.actionGrid}>
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={`${styles.actionCard} ${styles[action.color]}`}
                        onClick={() => navigate(action.path)}
                    >
                        <div className={styles.icon}>{action.icon}</div>
                        <h3 className={styles.actionTitle}>{action.title}</h3>
                        <p className={styles.description}>{action.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;
