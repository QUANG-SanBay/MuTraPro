import styles from './FooterBottom.module.scss';

function FooterBottom() {
    return (
        <div className={styles.bottom}>
            <div className={styles.container}>
                <p className={styles.copyright}>
                    © 2025 MuTraPro. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default FooterBottom;
