import { Link } from 'react-router-dom';
import styles from './FooterLinks.module.scss';

function FooterLinks() {
    const links = [
        { to: '/customer', label: 'Trang chủ' },
        { to: '/services', label: 'Dịch vụ' },
        { to: '/orders', label: 'Đơn hàng' },
        { to: '/payments', label: 'Thanh toán' },
        { to: '/about', label: 'Giới thiệu' },
    ];

    return (
        <div className={styles.column}>
            <h3 className={styles.columnTitle}>Liên kết</h3>
            <ul className={styles.linkList}>
                {links.map((link, index) => (
                    <li key={index}>
                        <Link to={link.to} className={styles.link}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FooterLinks;
