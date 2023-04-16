import React from "react";
import Logo from "../Logo/Logo";
import { NavLink } from "react-router-dom";
import "./SideDrawer.scss";
import Backdrop from "../BackDrop/BackDrop";
const sideDrawer = props => {
  return (
    <div className="onlyMobile">
      <Backdrop show={props.open} clicked={props.closed} />
      <div
        className={`SideDrawer ${props.open ? "Open" : "Close"}`}
        onClick={props.closed}
      >
        <Logo height="11%" />
        <nav className="nav--drawer">
          <NavLink
            to="/fund"
            exact
            className="nav__item--drawer"
            activeClassName="nav__item-active--drawer"
          >
            fund
          </NavLink>
          <NavLink
            to="/account"
            exact
            className="nav__item--drawer"
            activeClassName="nav__item-active--drawer"
          >
            account
          </NavLink>
          <NavLink
            to="/coupon"
            exact
            className="nav__item--drawer"
            activeClassName="nav__item-active--drawer"
          >
            coupon
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default sideDrawer;
