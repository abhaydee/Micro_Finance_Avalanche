import React, { useState } from "react";
import "./Footer.scss";
import Logo from "../../assets/image/icon.png";
import { NavLink } from "react-router-dom";
function Footer() {
  const navigationsList = useState([
    { url: "/fund", name: "fund" },
    { url: "/account", name: "account" },
    { url: "/coupon", name: "coupon" }
  ])[0];
  return (
    <div className="footer">
      <div className="footer__logo-box">
        <picture className="footer__logo">
          <img src={Logo} alt="Full Logo" className="footer__logo" />
        </picture>
      </div>
      <div className="row">
        <div className="col-1-of-2">
          <div className="footer__navigation">
            <ul className="footer__list">
              {navigationsList.map(nav => (
                <li className="footer__item" key={nav.name}>
                  <NavLink to={nav.url} exact className="footer__link">
                    {nav.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-1-of-2">
          <div className="footer__copyright">
            <p>
              Built by
              Abhay Deshpande and Teja Narasimha Reddy
            </p>
            <div>
              Icons made by &nbsp;
              <a
                href="https://www.flaticon.com/authors/freepik"
                title="Freepik"
                target="_blank"
                rel="noopener noreferrer"
              >
                Freepik
              </a>
              ,
              <a
                href="https://www.flaticon.com/authors/smashicons"
                title="Smashicons"
                target="_blank"
                rel="noopener noreferrer"
              >
                Smashicons
              </a>
              &nbsp; from &nbsp;
              <a
                href="https://www.flaticon.com/"
                title="Flaticon"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.flaticon.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
