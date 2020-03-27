import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import {Container, Row, Col, ButtonToolbar, Button} from 'react-bootstrap';

import {loginAPI, getUserAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../api/strings";

class Header extends React.Component {

    state = {
        menuItems: [],
        open: false,
        loggedin: false
    };

    changeMenuOptionsAuthenticated = () => {
        this.setState(() => ({menuItems: ["Log Out"], loggedin: true}));
    };

    changeMenuOptionsUnauthenticated = () => {
        this.setState(() => ({menuItems: ["Log In", "Register"], loggedin: false}));
    };

    loadUserService = () => {
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};

        axios.get(getUserAPI, {headers})
            .then((response) => {
              const userInfo = response.data;

                 this.props.dispatch(userInfoIn({
                      userName: userInfo.name,
                     userEmail: userInfo.email,
                     userActive: userInfo.active
                 }));
                //this.props.dispatch(loginUser());
                this.setState(() => ({isLoading: false, success: userInfo}));
                this.props.history.push("/home");
                }
            )
            .catch((error) => {
                console.log(error.response);
                window.localStorage.removeItem(ACCESS_TOKEN);
                this.props.dispatch(userInfoOut());
                this.props.dispatch(logoutUser());
            });
    };

    componentWillReceiveProps(nextProps) {
        let currentPath = this.props.location.pathname.toString();
        let nextPath = nextProps.location.pathname.toString();
        if (currentPath !== nextPath || this.props.authentication.isAuthenticated !== nextProps.authentication.isAuthenticated) {
            if (nextProps.authentication.isAuthenticated) {
                this.changeMenuOptionsAuthenticated();
                if (currentPath !== nextPath && this.props.userInfo.userActive === 0) {
                  this.props.history.push("/email/resend"); }

            } else {
                this.changeMenuOptionsUnauthenticated();
            }
        }
    }

    componentDidMount() {
        if (this.props.authentication.isAuthenticated) {
            this.changeMenuOptionsAuthenticated();

        } else {
            this.changeMenuOptionsUnauthenticated();
        }
    }

    //can use this method if you want to change logo link if authenticated
    displayHome() {
      if (this.props.authentication.isAuthenticated) {
        return (
          <LinkContainer to="/">
            <Navbar.Brand>
          {window.Laravel.app_name}
        </Navbar.Brand>
      </LinkContainer>);
      } else {
        return (
          <LinkContainer to="/"><Navbar.Brand>
          {window.Laravel.app_name}
        </Navbar.Brand>
      </LinkContainer>
      );
      }
    }

    //can use this to display a search bar component if authenticated
    displaySearchBar() {
      if (this.props.authentication.isAuthenticated) {

      }
    }

    displayLinksBar() {
      return (
        this.state.menuItems.map((item, key) => {
            if(item === "Log In"){
                return <LinkContainer to="/login" key={key}><Nav.Link key={key}>Login</Nav.Link></LinkContainer>
            }
            if(item === "Register"){
                return <LinkContainer to="/register" key={key}><Nav.Link key={key}>Register</Nav.Link></LinkContainer>
            }
            if(item === "Forgot Password"){
                return <LinkContainer to="/password/request" key={key}><Nav.Link key={key}>Forgot Password</Nav.Link></LinkContainer>
            }

            if(item === "Log Out"){
                return (
                <NavDropdown title={this.props.userInfo.userName} id="collapsible-nav-dropdown" key={key}>
                      <LinkContainer to="/logout">
                        <NavDropdown.Item>Logout</NavDropdown.Item>
                      </LinkContainer>
                </NavDropdown>)
            }
        })
      );
    }

render() {
    return (
      <Navbar className="shadow-sm " collapseOnSelect="collapseOnSelect" expand="md" bg="white" variant="light">
        <Container>
        <Nav className="">
            {this.displayHome()}
        </Nav>
        <Nav className="">
            {this.displaySearchBar()}
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse className="" id="responsive-navbar-nav">
            <Nav className="ml-auto">
                {this.displayLinksBar()}
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>)
}
}

const mapStateToProps = (state) => {
    return {
      userInfo: state.userInfo,
      authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(Header));
