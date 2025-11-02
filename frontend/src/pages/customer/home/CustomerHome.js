import Banner from "./banner/Banner";
import Prosecss from "./prosecss/Prosecss";
import Services from "./services/Services";

function CustomerHome() {
    return ( 
        <div>
            <Banner />
            <Services />
            <Prosecss />
        </div>      
     );
}

export default CustomerHome;