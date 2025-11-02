import { Link } from 'react-router-dom';
import styles from './Services.module.scss';

function Services() {
    const services = [
        {
            id: 'transcription',
            title: 'Ký âm (Transcription)',
            description: 'Chuyển đổi file audio/video thành bản ký âm chi tiết (MusicXML, PDF, MIDI).',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                </svg>
            ),
            color: '#667eea',
            link: '/services/transcription'
        },
        {
            id: 'arrangement',
            title: 'Phối khí (Arrangement)',
            description: 'Tạo bản phối hoàn chỉnh theo phong cách yêu cầu.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
            ),
            color: '#f093fb',
            link: '/services/arrangement'
        },
        {
            id: 'recording',
            title: 'Thu âm (Recording)',
            description: 'Thu âm giọng hát/nhạc cụ tại phòng thu chuyên nghiệp và bàn giao file chất lượng cao.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            ),
            color: '#f5576c',
            link: '/services/recording'
        }
    ];

    return (
        <section className={styles.services}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <p className={styles.badge}>DỊCH VỤ</p>
                    <h2 className={styles.title}>
                        Tất cả những gì bạn cần cho một bản nhạc hoàn chỉnh
                    </h2>
                    <p className={styles.subtitle}>
                        Chúng tôi hỗ trợ từ ký âm, phối khí đến thu âm chuyên nghiệp — đồng bộ trên một nền tảng
                    </p>
                </div>

                {/* Service Cards */}
                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className={styles.card}
                            style={{ '--card-color': service.color, '--animation-delay': `${index * 0.1}s` }}
                        >
                            <div className={styles.iconWrapper}>
                                <div className={styles.icon}>{service.icon}</div>
                            </div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDescription}>{service.description}</p>
                            <Link to={service.link} className={styles.cardLink}>
                                Tìm hiểu thêm
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services;