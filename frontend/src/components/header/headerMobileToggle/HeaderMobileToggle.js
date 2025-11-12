import styles from './HeaderMobileToggle.module.scss';

function HeaderMobileToggle({ isOpen, onToggle }) {
    return (
        <button
            className={styles.hamburger}
            onClick={onToggle}
            aria-label="Menu"
            aria-expanded={isOpen}
        >
            <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerLineOpen : ''}`}></span>
        </button>
    );
}

export default HeaderMobileToggle;
