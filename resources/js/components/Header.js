import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import {Container, Row, Col, ButtonToolbar, Button} from 'react-bootstrap';

import {loginAPI, getUserAPI, refreshTokenAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";


class Header extends React.Component {

    state = {
        menuItems: [],
        open: false,
        loggedin: false
    };

    changeMenuOptionsAuthenticated = () => {
        this.setState(() => ({menuItems: ["Home","Log Out"], loggedin: true}));
    };

    changeMenuOptionsUnauthenticated = () => {
        this.setState(() => ({menuItems: ["New Log In","Log In", "Register"], loggedin: false}));
    };

    componentDidUpdate() {
      if (this.props.authentication.isAuthenticated && !this.state.loggedin) {
          this.changeMenuOptionsAuthenticated();
      } else {
        if (!this.props.authentication.isAuthenticated && this.state.loggedin) {
          this.changeMenuOptionsUnauthenticated();
        }
      }
    }

    componentDidMount() {
      this.changeMenuOptionsUnauthenticated();
        if (this.props.authentication.isAuthenticated && !this.state.loggedin) {
            this.changeMenuOptionsAuthenticated();
        } else {
          if (!this.props.authentication.isAuthenticated && this.state.loggedin) {
            this.changeMenuOptionsUnauthenticated();
          }
        }

        //if accesstoken exists add it to the axios request
        axios.interceptors.request.use(
         config => {
             const token = this.props.authentication.accessToken;
             if (token) {
                 config.headers['Authorization'] = 'Bearer ' + token;
             }
             // config.headers['Content-Type'] = 'application/json';
             return config;
         },
         error => {
             Promise.reject(error)
         });

         axios.interceptors.response.use(
           response => response,
           error => {
             const originalRequest = error.config;
             //if the request just came from trying a refresh token send to login
             if (error.response.status === 401 && originalRequest.url === 'http://dev.react.local/api/refresh-token')
             {
                 dispatch(userInfoOut());
                 dispatch(logoutUser());
                 this.props.history.push("/login");
                 return Promise.reject(error);
               }

               if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const token = this.refreshToken();
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);

                }

            return Promise.reject(error);
          });

    }

    async refreshToken() {
      await axios.post(refreshTokenAPI)
          .then(res => {
              if (res.status === 200) {
                const authInfo = res.data;
                this.props.dispatch(loginUser({accessToken: authInfo.token}));
                return authInfo.token;
              }
            }).catch((error) => {
               const errors = error;
                        this.setState(() => ({
                            errors
                        }))
                    });
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
            if(item === "New Log In"){
                return <LinkContainer to="/newlogin" key={key}><Nav.Link key={key}>New Login</Nav.Link></LinkContainer>
            }
            if(item === "Log In"){
                return <LinkContainer to="/login" key={key}><Nav.Link key={key}>Login</Nav.Link></LinkContainer>
            }
            if(item === "Register"){
                return <LinkContainer to="/register" key={key}><Nav.Link key={key}>Register</Nav.Link></LinkContainer>
            }
            if(item === "Forgot Password"){
                return <LinkContainer to="/password/request" key={key}><Nav.Link key={key}>Forgot Password</Nav.Link></LinkContainer>
            }
            if(item === "Home"){
                return <LinkContainer to="/home" key={key}><Nav.Link key={key}>Home</Nav.Link></LinkContainer>
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
