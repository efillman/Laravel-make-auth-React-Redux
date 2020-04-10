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

class NewLoginComponent extends React.Component{

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

      window.addEventListener('message', (e) => {
        if (e.origin !== 'http://dev.react.local' || ! Object.keys(e.data).includes('access_token')) {
          return;
        }

        const {token_type, expires_in, access_token, refresh_token} = e.data;
        this.$axios.setToken(access_token, token_type);

        this.$axios.$get('http://dev.react.local/api/user')
          .then(resp => {
            console.log(resp);
          })
      });

      this.state.loginstate = this.createRandomString(40);
      const verifier = this.createRandomString(128);

      this.state.loginchallenge = this.base64Url(crypto.SHA256(verifier));
      window.localStorage.setItem('state', this.state.loginstate);
      window.localStorage.setItem('verifier', verifier);

      this.state.loginurl = 'http://dev.react.local/oauth/authorize?client_id=7&redirect_uri=http://dev.react.local/auth&response_type=code&scope=*&state=' + this.state.loginstate + '&code_challenge=' + this.state.loginchallenge + '&code_challenge_method=S256';


    }

    handleSubmit = (values, {
        props = this.props,
        setSubmitting
    }) => {
        this.setState(() => ({isLoading: true}));
        const data = {
            email: values.email,
            password: values.password,
        };

        axios.post(loginAPI, data)
        .then((response) => {
            const authInfo = response.data;
            this.props.dispatch(loginUser({accessToken: authInfo.token}));
            this.loadUserService();
        })
        .catch((error) => (
            this.setState(() => ({
                invalidCredentials: true,
                isLoading: false
            }))
        ));
    };

    schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required('Password is required')
    });

    openLoginWindow = () => {
      window.open(this.state.loginurl, 'popup', 'width=700,height=700');
    };

    base64Url = (input) => {
      return input.toString(crypto.enc.Base64)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    };

    createRandomString = (num) => {
      return [...Array(num)].map(() => Math.random().toString(36)[2]).join('')
    };



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
                        <Button onClick={this.openLoginWindow}>Login</Button>
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

export default connect(mapStateToProps)(withRouter(NewLoginComponent));
