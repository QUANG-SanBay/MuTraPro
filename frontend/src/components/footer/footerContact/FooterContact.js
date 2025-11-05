import styles from './FooterContact.module.scss';

function FooterContact() {
    const contactInfo = [
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            text: '123 Đường ABC, Quận 1, TP.HCM',
            type: 'text'
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            text: '(+84) 123 456 789',
            href: 'tel:+84123456789',
            type: 'link'
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
            text: 'contact@mutrapro.com',
            href: 'mailto:contact@mutrapro.com',
            type: 'link'
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            text: 'Thứ 2 - Thứ 6: 8:00 - 18:00',
            type: 'text'
        }
    ];

    return (
        <div className={styles.column}>
            <h3 className={styles.columnTitle}>Liên hệ</h3>
            <ul className={styles.contactList}>
                {contactInfo.map((item, index) => (
                    <li key={index} className={styles.contactItem}>
                        {item.icon}
                        {item.type === 'link' ? (
                            <a href={item.href} className={styles.contactLink}>
                                {item.text}
                            </a>
                        ) : (
                            <span>{item.text}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FooterContact;
