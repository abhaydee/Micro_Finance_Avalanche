import React from "react";
import "./LoginPage.scss";
import Logo from "../../assets/image/icon.png";
import { connect } from "react-redux";
import MetamaskLogo from "../../assets/image/metamask.png";
import * as actions from "../../store/actions/index";
import { Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Connect } from "../../core/Connect";
function LoginPage(props) {
  const { address, authRedirectPath, loading, error, onAuth } = props;
  return (
    <div className="bg-color">
      {!!address && <Redirect to={authRedirectPath} />}
      <div className="login__content">
        <div className="login__title">
          <img src={Logo} alt="logo" />
          <h2>
            Welcome to MicroFinance
          </h2>
        </div>
        <div className="btn-login">
          <button onClick={() => onAuth()}>
            Connect with Core wallet
          </button>
          {/* <Connect/> */}
          <img src={MetamaskLogo} alt="metamask" />
        </div>
        {loading && <CircularProgress />}
        {!!error && <p>{error}</p>}
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    address: state.address,
    loading: state.loading,
    error: state.error,
    authRedirectPath: state.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: () => dispatch(actions.auth())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
