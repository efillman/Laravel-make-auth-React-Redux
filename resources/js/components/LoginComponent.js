import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';

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
        const access_token = window.localStorage.getItem(ACCESS_TOKEN);
        const headers = {Accept: "application/json", Authorization: `Bearer ${access_token}`};

        axios.get(getUserAPI, {headers})
            .then((response) => {
              const userInfo = response.data;

                 this.props.dispatch(userInfoIn({
                      userName: userInfo.name,
                     userEmail: userInfo.email,
                     userActive: userInfo.email_verified_at
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

    componentDidMount(){
        if(window.localStorage.getItem(ACCESS_TOKEN) !== null){
            // means the user is already logged in, check if it is valid
            this.setState(() => ({isLoading: true}));
            this.loadUserService();
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
            window.localStorage.setItem(ACCESS_TOKEN, response.data.token);
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

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }
        return (<Container className="py-1">
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
                                      <Form.Row className="">
                                            <Form.Group as={Col} md="6" controlId="validationFormik03">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text" placeholder="Email" autoComplete="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={touched.email && errors.email}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" controlId="validationFormik04">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" autoComplete="new-password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={touched.email && errors.password}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                        <Button type="submit" disabled={this.isSubmitting}>Login</Button>
                                        </Form.Row>
                                    </Form>
                                    <Row>
                                      <Col md="auto" className={"py-1"}><Link to={"/register"} className={"btn btn-primary"}>Register</Link></Col>
                                      <Col md="auto" className={"py-1"}><Link to={"/password/request"} className={"btn btn-primary"}>Forgot Password</Link></Col>
                                      <Col md="auto" className={"py-1"}><Link to={"/terms"} className={"btn btn-primary"}>Terms</Link></Col>
                                    </Row>
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
