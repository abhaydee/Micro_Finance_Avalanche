import React, { useState } from "react";
import Navigation from "../../container/Navigation/Navigation";
import Footer from "../../container/Footer/Footer";
import SideDrawer from "../../component/SideDrawer/SideDrawer";
import "./Layout.scss";
function Layout(props) {
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const sideDrawerClosedHandler = () => {
    setShowSideDrawer(false);
  };
  const sideDrawerToggleHandler = () => {
    setShowSideDrawer(!showSideDrawer);
  };
  return (
    <React.Fragment>
      <Navigation drawerToggleClicked={sideDrawerToggleHandler} />
      <SideDrawer
        isAuth={props.isAuthenticated}
        open={showSideDrawer}
        closed={sideDrawerClosedHandler}
      />
      <div className="content">{props.children}</div>
      <Footer />
    </React.Fragment>
  );
}

export default Layout;
