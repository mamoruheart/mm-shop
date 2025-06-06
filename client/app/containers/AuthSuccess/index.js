import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import actions from "../../actions";
import setToken from "../../utils/token";
import LoadingIndicator from "../../components/Common/LoadingIndicator";

class AuthSuccess extends React.PureComponent {
  componentDidMount() {
    const tokenParam = this.props.location.search;
    const jwtCookie = tokenParam
      .slice(tokenParam.indexOf("=") + 1)
      .replace("%20", " ");

    if (jwtCookie) {
      setToken(jwtCookie);
      localStorage.setItem("token", jwtCookie);
      this.props.setAuth();
    }
  }

  render() {
    const { authenticated } = this.props;

    if (authenticated) return <Redirect to="/dashboard" />;

    return <LoadingIndicator />;
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(AuthSuccess);
