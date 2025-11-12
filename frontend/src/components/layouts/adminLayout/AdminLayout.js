import Header from '~/components/header/Header';
import Footer from '~/components/footer/Footer';
import styles from './AdminLayout.module.scss';

function AdminLayout({ children }) {
    return ( 
        <div className={styles.adminLayout}>
            <Header userType="admin" />
            <main className={styles.content}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default AdminLayout;