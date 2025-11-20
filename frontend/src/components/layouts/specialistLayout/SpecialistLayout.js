import Header from '~/components/header/Header';
import Footer from '~/components/footer/Footer';
import styles from './SpecialistLayout.module.scss';

function SpecialistLayout({ children }) {
    return ( 
        <div className={styles.specialistLayout}>
            <Header userType="specialist" />
            <main className={styles.content}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default SpecialistLayout;
