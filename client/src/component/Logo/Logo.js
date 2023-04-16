import React from "react";
import HeartLogo from "../../assets/image/icon.png";
import "./Logo.scss";
const logo = props => (
  <div className="Logo" style={{ height: props.height }}>
    <img src={HeartLogo} alt="heart logo" />
  </div>
);
export default logo;
