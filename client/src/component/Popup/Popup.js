import React from "react";
import "./Popup.scss";
import Backdrop from "../BackDrop/BackDrop";
import PersonLogo from "../../assets/image/person.svg";
import PhoneLogo from "../../assets/image/phone.svg";
import AddressLogo from "../../assets/image/address.svg";
import { PhoneTextFormatCustom } from "../../scripts/utility";
function Popup(props) {
  return (
    <React.Fragment>
      <Backdrop show={props.show} clicked={props.closed} />
      <div className={`popup ${props.show && "popup--open"}`}>
        <div className="popup__content">
          <div className="popup__title popup__flex">
            <img src={PersonLogo} alt="personLogo" />
            <span>{props.name}</span>
            <div className="x-touch" onClick={props.closed}>
              <div className="x">
                <div className="line1"></div>
                <div className="line2"></div>
              </div>
            </div>
          </div>
          <div className="popup__infor">
            <div className="popup__addr popup__flex">
              <img src={AddressLogo} alt="addresslogo" />
              <span>{props.address}</span>
            </div>
            <div className="popup__phone popup__flex">
              <img src={PhoneLogo} alt="phonelogo" />
              <PhoneTextFormatCustom
                value={props.phone}
                renderText={value => <span>{value}</span>}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default React.memo(
  Popup,
  (prevProps, nextProps) => nextProps.show === prevProps.show
);
