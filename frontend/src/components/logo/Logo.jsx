import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import styles from "./Logo.module.scss"
function Logo({className}) {
    return ( 
        <div className={clsx(styles.logo, className)}>
            <div className={styles.icon}>
                <FontAwesomeIcon icon={faMusic} />
            </div>
            <span className={styles.text}>MuTraPro</span>
        </div>
     );
}

export default Logo;