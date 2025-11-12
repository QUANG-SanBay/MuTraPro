import Header from '~/components/header/Header';
import Footer from '~/components/footer/Footer';
// import styles from './AdminLayout.module.scss';

function AdminLayout({ children }) {
    return ( 
        <div>
            <Header userType="admin" />
            <main >
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default AdminLayout;