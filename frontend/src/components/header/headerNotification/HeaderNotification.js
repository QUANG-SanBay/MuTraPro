import { Link } from 'react-router-dom';
import styles from './HeaderNotification.module.scss';

function HeaderNotification({ isOpen, onToggle, onClose }) {
    const notifications = [
        {
            id: 1,
            text: 'Đơn hàng #12345 đã được xác nhận',
            time: '5 phút trước',
            isRead: false,
        },
        {
            id: 2,
            text: 'Bạn có một tin nhắn mới từ Studio A',
            time: '1 giờ trước',
            isRead: false,
        },
        {
            id: 3,
            text: 'Thanh toán cho đơn hàng #12340 thành công',
            time: '2 giờ trước',
            isRead: false,
        },
    ];

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className={styles.notificationWrapper}>
            <button
                className={styles.iconButton}
                aria-label="Thông báo"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.notificationDropdown}>
                    <div className={styles.notificationHeader}>
                        <h3>Thông báo</h3>
                        <button className={styles.markAllRead}>Đánh dấu đã đọc</button>
                    </div>
                    <div className={styles.notificationList}>
                        {notifications.map((notification) => (
                            <div key={notification.id} className={styles.notificationItem}>
                                {!notification.isRead && <div className={styles.notificationDot}></div>}
                                <div className={styles.notificationContent}>
                                    <p
                                        className={styles.notificationText}
                                        dangerouslySetInnerHTML={{
                                            __html: notification.text.replace(
                                                /#\d+|Studio A/g,
                                                '<strong>$&</strong>'
                                            ),
                                        }}
                                    />
                                    <span className={styles.notificationTime}>{notification.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/notifications" className={styles.notificationFooter} onClick={onClose}>
                        Xem tất cả thông báo
                    </Link>
                </div>
            )}
        </div>
    );
}

export default HeaderNotification;
