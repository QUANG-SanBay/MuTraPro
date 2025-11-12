import styles from './Prosecss.module.scss';

function Prosecss() {
    const steps = [
        {
            number: 1,
            title: 'Gửi yêu cầu',
            description: 'Tải file và mô tả nhu cầu.',
        },
        {
            number: 2,
            title: 'Phân công',
            description: 'Điều phối viên gán chuyên gia phù hợp.',
        },
        {
            number: 3,
            title: 'Thực hiện',
            description: 'Ký âm / phối khí / thu âm theo yêu cầu.',
        },
        {
            number: 4,
            title: 'Phê duyệt',
            description: 'Bạn xem trước và yêu cầu chỉnh sửa nếu cần.',
        },
        {
            number: 5,
            title: 'Bàn giao & thanh toán',
            description: 'Nhận sản phẩm hoàn chỉnh và hoá đơn.',
        },
    ];

    return (
        <section className={styles.process}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <p className={styles.badge}>QUY TRÌNH</p>
                    <h2 className={styles.title}>Làm việc đơn giản trong 5 bước</h2>
                </div>

                {/* Steps */}
                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className={styles.step}
                            style={{ '--step-delay': `${index * 0.1}s` }}
                        >
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepContent}>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                            {/* Connector line (không hiển thị cho step cuối) */}
                            {index < steps.length - 1 && (
                                <div className={styles.connector}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Prosecss;
