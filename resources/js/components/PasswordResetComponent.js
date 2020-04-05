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
import {resetInUser, resetOutUser} from "../actions/resetPassword";

import LoadingScreen from "../components/LoadingScreen";
import * as yup from 'yup'; // for everything
import {Formik} from 'formik';
import qs from 'qs';

const s = "success";

class PasswordResetComponent extends React.Component {

    state = {
        isLoading: false,
        errors: [],
        success: []
    };

    loadUserService = () => {

        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${this.props.authentication.accessToken}`
        };

        axios.get(getUserAPI, {headers}).then((response) => {
            const userInfo = response.data;

            this.props.dispatch(userInfoIn({userName: userInfo.name, userEmail: userInfo.email, userActive: userInfo.active}));
            //this.props.dispatch(loginUser());
            this.setState(() => ({isLoading: false, success: userInfo}));
            this.props.history.push("/home");
        }).catch((error) => {
            console.log(error.response);

            this.props.dispatch(userInfoOut());
            this.props.dispatch(logoutUser());
        });
    };

    //grab token and email from url and send to redux state
    componentDidMount() {
        this.setState(() => ({isLoading: true}));

        if (this.props.match.path === "/password/reset/:resettoken") {
            if ((this.props.match.params.resettoken !== null)) {

                const data = {
                    token: this.props.match.params.resettoken,
                    email: unescape(qs.parse(this.props.location.search, {ignoreQueryPrefix: true}).email)
                };
                this.props.dispatch(resetInUser({resetEmail: data.email, resetToken: data.token}));
                this.setState(() => ({isLoading: false}));
            }
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
            const authInfo = response.data;
            this.props.dispatch(loginUser({accessToken: authInfo.token}));
            this.loadUserService();
        }).catch((error) => {
            const errors = Object.values(error.response.data.errors);
            this.setState(() => ({isLoading: false, errors}));
        });
        this.props.dispatch(resetOutUser());
    };

    schema = yup.object().shape({
        token: yup.string().min(30),
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
        return (<Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header>Reset Password</Card.Header>
                        <Card.Body>
                            {
                                this.state.errors.length > 0 && <div className="alert alert-danger">
                                        <ul>
                                            {
                                                this.state.errors.map((item, key) => {
                                                    return <li key={key}>{item}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                            }
                            {
                                this.state.success.length > 0 && <div className="alert alert-success">
                                        <ul>
                                            {
                                                this.state.success.map((item, key) => {
                                                    return <li key={key}>{item}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
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
                                    }) => (<Form noValidate="noValidate" onSubmit={handleSubmit}>
                                        <Form.Group as={Row} controlId="validationFormik03">
                                            <Form.Label column="column" md="4" className="text-md-right">E-Mail Address</Form.Label>
                                            <Col md={6}>
                                                <Form.Control type="text" disabled="true" placeholder="Email" autoComplete="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={!errors.email} isInvalid={errors.email}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="validationFormik04">
                                            <Form.Label column="column" md="4" className="text-md-right">Password</Form.Label>
                                            <Col md={6}>
                                                <Form.Control type="password" placeholder="Password" autoComplete="new-password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={touched.password && errors.password}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="validationFormik05">
                                            <Form.Label column="column" md="4" className="text-md-right">Confirm Password</Form.Label>
                                            <Col md={6}>
                                                <Form.Control type="password" placeholder="Confirm Password" autoComplete="current-password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} isValid={touched.confirmPassword && !errors.confirmPassword} isInvalid={touched.password && errors.confirmPassword}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Col md={{
                                                    span: 8,
                                                    offset: 4
                                                }}>
                                                <Button type="submit" disabled={this.isSubmitting}>Reset Password</Button>
                                            </Col>
                                        </Form.Group>
                                    </Form>)
                                }
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>);
    }

}

const mapStateToProps = (state) => {
    return {resetPassword: state.resetPassword, authentication: state.authentication, userInfo: state.userInfo};
};

export default connect(mapStateToProps)(withRouter(PasswordResetComponent));
