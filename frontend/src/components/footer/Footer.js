import { useState, useEffect } from 'react';
import styles from './Footer.module.scss';
import FooterBrand from './footerBrand/FooterBrand';
import FooterLinks from './footerLinks/FooterLinks';
import FooterSupport from './footerSupport/FooterSupport';
import FooterContact from './footerContact/FooterContact';
import FooterBottom from './footerBottom/FooterBottom';
import { getPublicSettings } from '~/api/adminService';

function Footer() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        loadPublicSettings();
    }, []);

    const loadPublicSettings = async () => {
        try {
            const response = await getPublicSettings();
            if (response && response.settings) {
                setSettings(response.settings);
            }
        } catch (error) {
            console.error('[Footer] Error loading public settings:', error);
            // Use defaults if API fails
            setSettings({
                siteName: 'MuTraPro',
                siteDescription: 'Nền tảng ký âm, phối khí, thu âm theo yêu cầu.',
                contactEmail: 'contact@mutrapro.com',
                supportPhone: '1900-xxxx',
                timezone: 'Asia/Ho_Chi_Minh',
                language: 'vi'
            });
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <FooterBrand settings={settings} />
                <FooterLinks />
                <FooterSupport />
                <FooterContact settings={settings} />
            </div>

            <FooterBottom />
        </footer>
    );
}

export default Footer;