import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
    Card,
    Form,
    FormControl,
    Button,
    Container,
    Row,
    Col,
    InputGroup
} from 'react-bootstrap';

import {getUserAPI, registerAPI, passwordResetAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";
import {ACCESS_TOKEN} from "../api/strings";

import LoadingScreen from "../components/LoadingScreen";
import * as yup from 'yup'; // for everything
import {Formik} from 'formik';

const s = "success";

class PasswordResetComponent extends React.Component {

    state = {
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

    //check to ensure the state has the proper emails and token
    componentDidMount() {
        if (this.props.resetPassword.resetToken === "") {
          this.props.history.push("/password/request");
        }
    }

    handleSubmit = (values, {
        props = this.props,
        setSubmitting
    }) => {

        this.setState(() => ({isLoading: true}));
        const data = {
            token: this.props.resetPassword.resetToken,
            email: this.props.resetPassword.resetEmail,
            password: values.password,
            password_confirmation: values.confirmPassword
        };

        axios.post(passwordResetAPI, data).then((response) => {
          window.localStorage.setItem(ACCESS_TOKEN, response.data.token);
          const authInfo = response.data;
          this.props.dispatch(loginUser({accessToken: authInfo.token}));
          this.loadUserService();
        }).catch((error) => {
            const errors = Object.values(error.response.data.errors);
            this.setState(() => ({isLoading: false, errors}));
        });
    };

    schema = yup.object().shape({
        token: yup.string().min(60),
        email: yup.string().email().required(),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup.string().oneOf([
            yup.ref('password'), null
        ], 'Passwords must match').required('Password confirm is required')
    });

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }
        return (<Container>
            <Row className="justify-content-center">
                <Col lg={7} md={7}>
                    {this.state.errors.length > 0 &&
                      <Card bg="danger" text="white">
                          <Card.Header>Reset Error</Card.Header>
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
                            email: this.props.resetPassword.resetEmail,
                            password: '',
                            confirmPassword: ''
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
                                <Card.Header>Register</Card.Header>
                                <Card.Body>
                                    <Form noValidate="noValidate" onSubmit={handleSubmit}>
                                        <Form.Row>
                                            <Form.Group as={Col} md="6" controlId="validationFormik03">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text" disabled="true" placeholder="Email" autoComplete="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={!!errors.email}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col} md="3" controlId="validationFormik04">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" autoComplete="new-password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={!!errors.password}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} md="3" controlId="validationFormik05">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control type="password" placeholder="Confirm Password" autoComplete="current-password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} isValid={touched.confirmPassword && !errors.confirmPassword} isInvalid={!!errors.confirmPassword}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Button type="submit" disabled={this.isSubmitting}>Submit form</Button>
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
        resetPassword: state.resetPassword,
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(PasswordResetComponent));
