import React, { Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Layout from "../../hoc/Layout/Layout";
import BackDrop from "../../component/BackDrop/BackDrop";
import Loading from "../../assets/image/loading-heart.svg";
import { connect } from "react-redux";
const FundPage = React.lazy(() => {
  return import("../FundPage/FundPage");
});
const AccountPage = React.lazy(() => {
  return import("../AccountPage/AccountPage");
});
const CouponPage = React.lazy(() => {
  return import("../CouponPage/CouponPage");
});
function UserPage(props) {
  const { infor } = props;
  return (
    <Layout>
      <Suspense
        fallback={
          <BackDrop show="true">
            <img src={Loading} alt="spinner" className="spinner" />
          </BackDrop>
        }
      >
        <Switch>
          {!infor && <Redirect to="/infor" />}
          <Route path="/fund" exact render={props => <FundPage {...props} />} />
          <Route
            path="/account"
            exact
            render={props => <AccountPage {...props} />}
          />
          <Route
            path="/coupon"
            exact
            render={props => <CouponPage {...props} />}
          />
          <Redirect to="/fund"  />
        </Switch>
      </Suspense>
    </Layout>
  );
}
const mapStateToProps = state => {
  return {
    infor: state.infor
  };
};
export default connect(mapStateToProps)(UserPage);
