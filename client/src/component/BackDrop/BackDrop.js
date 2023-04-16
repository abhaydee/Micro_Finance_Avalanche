import React from "react";
import "./BackDrop.scss";
const Backdrop = props =>
  props.show ? (
    <div className="backdrop" onClick={props.clicked}>
      {props.children}
    </div>
  ) : null;

export default Backdrop;
