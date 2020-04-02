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

class LoginComponent extends React.Component{

    state = {
        passwordHelp: undefined,
        usernameHelp: undefined,
        invalidCredentials: undefined,
        isLoading: false,
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
        if(this.props.authentication.accessToken !== ""){
            // means the user is already logged in, check if it is valid
            this.setState(() => ({isLoading: true}));
            this.loadUserService();
            this.setState(() => ({isLoading: false}));
        }
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

    //TODO figureout how to load into errors from backend
    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }
        return (<Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    {this.state.errors.length > 0 &&
                      <Card bg="danger" text="white">
                          <Card.Header>Login Error</Card.Header>
                          <Card.Body>
                            <ul>
                            {this.state.errors.map((item, key) => {
                              return <li key={key}>{item}</li>
                            })}
                            </ul>
                          </Card.Body>
                      </Card>
                    }
                    <Formik validationSchema={this.schema} onSubmit={this.handleSubmit} initialValues={{
                            email: '',
                            password: '',
                        }}>
                        {
                            ({
                                values,
                                errors,
                                status,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                isSubmitting
                            }) => (<Card>
                                <Card.Header>Login</Card.Header>
                                <Card.Body>
                                    <Form noValidate="noValidate" onSubmit={handleSubmit}>
                                            <Form.Group as={Row} controlId="validationFormik03">
                                                <Form.Label column md="4" className="text-md-right">E-Mail Address</Form.Label>
                                                <Col md={6}>
                                                  <Form.Control type="text" placeholder="Email" autoComplete="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={touched.email && errors.email}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="validationFormik04">
                                                <Form.Label column md="4" className="text-md-right">Password</Form.Label>
                                                <Col md={6}>
                                                <Form.Control type="password" placeholder="Password" autoComplete="new-password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={touched.email && errors.password}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                              <Form.Group as={Row}>
                                              <Col md={{ span: 8, offset: 4 }}>
                                            <Button type="submit" disabled={this.isSubmitting}>Login</Button>
                                              <LinkContainer to="/password/reset"><Button variant="link">Forgot Your Password?</Button></LinkContainer>
                                              </Col>
                                            </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>)
                        }
                    </Formik>
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

export default connect(mapStateToProps)(withRouter(LoginComponent));
