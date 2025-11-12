import { Link } from 'react-router-dom';
import styles from './FooterSupport.module.scss';

function FooterSupport() {
    const supportLinks = [
        { to: '/faq', label: 'Câu hỏi thường gặp' },
        { to: '/help', label: 'Trung tâm trợ giúp' },
        { to: '/terms', label: 'Điều khoản sử dụng' },
        { to: '/privacy', label: 'Chính sách bảo mật' },
        { to: '/refund', label: 'Chính sách hoàn tiền' },
    ];

    return (
        <div className={styles.column}>
            <h3 className={styles.columnTitle}>Hỗ trợ</h3>
            <ul className={styles.linkList}>
                {supportLinks.map((link, index) => (
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

export default FooterSupport;
