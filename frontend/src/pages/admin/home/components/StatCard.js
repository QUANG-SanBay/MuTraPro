import styles from './StatCard.module.scss';

function StatCard({ title, value, icon, trend, trendValue, colorClass }) {
    return (
        <div className={`${styles.statCard} ${styles[colorClass] || ''}`}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                    {icon}
                </div>
                <div className={styles.info}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.value}>{value}</p>
                </div>
            </div>
            {trend && (
                <div className={styles.trend}>
                    <span className={`${styles.trendIcon} ${trend === 'up' ? styles.trendUp : styles.trendDown}`}>
                        {trend === 'up' ? '↑' : '↓'}
                    </span>
                    <span className={styles.trendValue}>{trendValue}</span>
                    <span className={styles.trendText}>so với tháng trước</span>
                </div>
            )}
        </div>
    );
}

export default StatCard;
