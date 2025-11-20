import Header from '~/components/header/Header';
import Footer from '~/components/footer/Footer';
import styles from './CoordinatorLayout.module.scss';

function CoordinatorLayout({ children }) {
    return ( 
        <div className={styles.coordinatorLayout}>
            <Header userType="service_coordinator" />
            <main className={styles.content}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default CoordinatorLayout;
