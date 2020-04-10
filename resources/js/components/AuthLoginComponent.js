import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";

import {loginAPI, getUserAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../api/strings";

import LoadingScreen from "../components/LoadingScreen";
import * as yup from 'yup'; // for everything
import {Formik} from 'formik';
import crypto from 'crypto-js';
import qs from 'qs';

class AuthLoginComponent extends React.Component{

    state = {
        passwordHelp: undefined,
        usernameHelp: undefined,
        invalidCredentials: undefined,
        isLoading: false,
        email: '',
        password: '',
        loginstate: '',
        loginchallenge: '',
        loginurl: '',
        errors: []
    };

    loadUserService = () => {
        const headers = {Accept: "application/json", Authorization: `Bearer ${this.props.authentication.accessToken}`};

        axios.get(getUserAPI, {headers})
            .then((response) => {
              const userInfo = response.data;

                 this.props.dispatch(userInfoIn({
                      userName: userInfo.name,
                     userEmail: userInfo.email,
                     userActive: userInfo.email_verified_at
                 }));
                //this.props.dispatch(loginUser());
                if (this.props.userInfo.userActive === null || this.props.userInfo.userActive === 0) {
                  if(this.props.match.path !== "/email/verify" || this.props.match.path !== "/email/verify/:verifyid/:verifytoken") {
                    this.props.history.push("/email/verify");
                  }
                } else {

                this.props.history.push("/home");
                }
                }
            )
            .catch((error) => {
                console.log(error.response);
                this.props.dispatch(userInfoOut());
                this.props.dispatch(logoutUser());
            });


    };

    componentDidMount(){

        const code = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).code
        const state = qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).state

        if (code && state) {
        if (state === window.localStorage.getItem('state')) {
          let params = {
            grant_type: 'authorization_code',
            client_id: 7,
            redirect_uri: 'http://dev.react.local/auth',
            code_verifier: window.localStorage.getItem('verifier'),
            code
          }

          axios.post('http://dev.react.local/oauth/token', params)
            .then((resp) => {
                const authInfo = resp.data;
              window.opener.postMessage(authInfo);
              localStorage.removeItem('state');
              localStorage.removeItem('verifier');
              window.close();
            })
            .catch(e => {
              console.dir(e);
            });
        }
      }
    }





    //TODO figureout how to load into errors from backend
    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }
        return (<Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                      <Card.Header>Login</Card.Header>
                      <Card.Body>
                        Logging in...
                      </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>);
    }

}



const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(AuthLoginComponent));
