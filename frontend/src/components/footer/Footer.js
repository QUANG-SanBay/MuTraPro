import { Link } from 'react-router-dom';
import Logo from '~/components/logo/Logo';
import styles from './Footer.module.scss';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Cột 1: Logo & Giới thiệu */}
                <div className={styles.column}>
                    <Logo className={styles.logo} />
                    <p className={styles.description}>
                        Nền tảng ký âm, phối khí, thu âm theo yêu cầu.
                    </p>
                    <div className={styles.social}>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className={styles.socialLink}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className={styles.socialLink}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className={styles.socialLink}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Cột 2: Liên kết */}
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Liên kết</h3>
                    <ul className={styles.linkList}>
                        <li>
                            <Link to="/customer" className={styles.link}>
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <Link to="/services" className={styles.link}>
                                Dịch vụ
                            </Link>
                        </li>
                        <li>
                            <Link to="/orders" className={styles.link}>
                                Đơn hàng
                            </Link>
                        </li>
                        <li>
                            <Link to="/payments" className={styles.link}>
                                Thanh toán
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className={styles.link}>
                                Giới thiệu
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 3: Hỗ trợ */}
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Hỗ trợ</h3>
                    <ul className={styles.linkList}>
                        <li>
                            <Link to="/faq" className={styles.link}>
                                Câu hỏi thường gặp
                            </Link>
                        </li>
                        <li>
                            <Link to="/help" className={styles.link}>
                                Trung tâm trợ giúp
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms" className={styles.link}>
                                Điều khoản sử dụng
                            </Link>
                        </li>
                        <li>
                            <Link to="/privacy" className={styles.link}>
                                Chính sách bảo mật
                            </Link>
                        </li>
                        <li>
                            <Link to="/refund" className={styles.link}>
                                Chính sách hoàn tiền
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Cột 4: Liên hệ */}
                <div className={styles.column}>
                    <h3 className={styles.columnTitle}>Liên hệ</h3>
                    <ul className={styles.contactList}>
                        <li className={styles.contactItem}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>123 Đường ABC, Quận 1, TP.HCM</span>
                        </li>
                        <li className={styles.contactItem}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <a href="tel:+84123456789" className={styles.contactLink}>
                                (+84) 123 456 789
                            </a>
                        </li>
                        <li className={styles.contactItem}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <a href="mailto:contact@mutrapro.com" className={styles.contactLink}>
                                contact@mutrapro.com
                            </a>
                        </li>
                        <li className={styles.contactItem}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Thứ 2 - Thứ 6: 8:00 - 18:00</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright bar */}
            <div className={styles.bottom}>
                <div className={styles.container}>
                    <p className={styles.copyright}>
                        © 2025 MuTraPro. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;