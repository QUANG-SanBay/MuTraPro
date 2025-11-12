import Header from '~/components/header/Header';
import Footer from '~/components/footer/Footer';
import styles from './StudioLayout.module.scss';

function StudioLayout({ children }) {
    return ( 
        <div className={styles.studioLayout}>
            <Header userType="studio_administrator" />
            <main className={styles.content}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default StudioLayout;
