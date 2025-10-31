
function DefaultLayout() {
    return ( 
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default DefaultLayout;