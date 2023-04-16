import React, { Suspense, useEffect } from "react";
import "./App.scss";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import BackDrop from "./component/BackDrop/BackDrop";
import Loading from "./assets/image/loading-heart.svg";
// import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
// const activeChainId = ChainId.Goerli;
const UserPage = React.lazy(() => {
  return import("./container/UserPage/UserPage");
});
const LoginPage = React.lazy(() => {
  return import("./container/LoginPage/LoginPage");
});
const InfoPage = React.lazy(() => {
  return import("./container/InfoPage/InfoPage");
});
function App(props) {
  let routes = null;
  useEffect(() => {
    import("./blockchain/publicEntryInfo").then(publicEntryInfo => {
      publicEntryInfo.default.options.from = props.address;
    });
  }, [props.address]);
  if (!!props.address) {
    routes = (
      <Switch>
        <Route path="/infor" render={props => <InfoPage {...props} />} />
        <Route path="/" render={props => <UserPage {...props} />} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/login" render={props => <LoginPage {...props} />} />
        <Redirect to="/login" />
      </Switch>
    );
  }
  return (
    <Suspense
      fallback={
        <BackDrop open={true}>
          <Loading />
        </BackDrop>
      }
    >
      {routes}
    </Suspense>
  );
}
const mapStateToProps = state => {
  return {
    address: state.address
  };
};
export default connect(mapStateToProps)(App);
