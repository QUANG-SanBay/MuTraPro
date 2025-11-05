import Header from "~/components/header/Header";
import Footer from "~/components/footer/Footer";

function DefaultLayout({type, children}) {
    return ( 
        <div>
            <Header type={type}/>
            <main style={{marginBottom:'20px', marginTop: '20px'}}>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default DefaultLayout;