import React, { useState, useEffect  } from "react";
import '../../fonts/Fonts.css';
import './Footer.css'
import { Link } from 'react-router-dom';

import { footers } from "..";

const Footer = () => {
    const [active, setActive] = useState(() => {
        return localStorage.getItem("activeFooterIcon") || "";
    });

    useEffect(() => {
        localStorage.setItem("activeFooterIcon", active);
    }, [active]);

    return (
        <div className={"footer-container"}>
            <div className={"footer-nav"}>
                {footers.map((footer) => {
                    return (
                        <Link
                            key={footer.title}
                            to={`/${footer.titleLink}`}
                            className={`footerIcon`}
                            onClick={() => setActive(footer.title)}
                        >
                            <div
                                style={{color: `${active === footer.title
                                    ? "black"
                                    : "#7c7c7c"
                                    }`}}
                            >
                                {footer.img}
                                <p>{footer.title}</p>
                            </div>
                        </Link>
                    )
                })}

            </div>
        </div >
    )
}

export default Footer;