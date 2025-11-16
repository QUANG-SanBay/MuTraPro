import styles from './Footer.module.scss';
import FooterBrand from './footerBrand/FooterBrand';
import FooterLinks from './footerLinks/FooterLinks';
import FooterSupport from './footerSupport/FooterSupport';
import FooterContact from './footerContact/FooterContact';
import FooterBottom from './footerBottom/FooterBottom';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <FooterBrand />
                <FooterLinks />
                <FooterSupport />
                <FooterContact />
            </div>

            <FooterBottom />
        </footer>
    );
}

export default Footer;