import Header from "~/components/header/Header";
import Footer from "~/components/footer/Footer";

function DefaultLayout({userType, children}) {
    return ( 
        <div>
            <Header userType={userType}/>
            <main style={{marginBottom:'20px', marginTop: '20px'}}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default DefaultLayout;