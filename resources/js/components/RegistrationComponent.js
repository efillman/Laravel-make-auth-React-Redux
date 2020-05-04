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

import {getUserAPI, registerAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";
import {ACCESS_TOKEN} from "../api/strings";

import LoadingScreen from "../components/LoadingScreen";
import * as yup from 'yup'; // for everything
import {Formik} from 'formik';

const s = "success";

class RegistrationComponent extends React.Component {

    state = {
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
                this.setState(() => ({isLoading: false, success: userInfo}));
                this.props.history.push("/email/verify");
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
        }
    }

    handleSubmit = (values, {
        props = this.props,
        setSubmitting
    }) => {

        this.setState(() => ({isLoading: true}));
        const data = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.confirmPassword
        };

        axios.post(registerAPI, data).then((response) => {
          const authInfo = response.data;
          this.props.dispatch(loginUser({accessToken: authInfo.token}));
          this.loadUserService();
        }).catch((error) => {
            const errors = Object.values(error.response.data.error);
            this.setState(() => ({isLoading: false, errors}));
        });
    };

    schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: yup.string().oneOf([
            yup.ref('password'), null
        ], 'Passwords must match').required('Password confirm is required'),
    });

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }
        return (<Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    {this.state.errors.length > 0 &&
                      <Card bg="danger" text="white">
                          <Card.Header>Registration Error</Card.Header>
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
                            name: '',
                            email: '',
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
                                        <Form.Group as={Row} controlId="validationFormik01">
                                            <Form.Label column md="4" className="text-md-right">Name</Form.Label>
                                            <Col md={6}>
                                              <Form.Control type="text" placeholder="Name" autoComplete="given-name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} isValid={touched.name && !errors.name} isInvalid={touched.name && errors.name}/>
                                              <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>

                                            <Form.Group as={Row} controlId="validationFormik03">
                                                <Form.Label column md="4" className="text-md-right">E-Mail Address</Form.Label>
                                                <Col md={6}>
                                                  <Form.Control type="text" placeholder="E-Mail Address" autoComplete="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={touched.email && errors.email}/>
                                                  <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>


                                            <Form.Group as={Row} controlId="validationFormik04">
                                                <Form.Label column md="4" className="text-md-right">Password</Form.Label>
                                                <Col md={6}>
                                                  <Form.Control type="password" placeholder="Password" autoComplete="new-password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={touched.password && errors.password}/>
                                                  <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="validationFormik05">
                                                <Form.Label column md="4" className="text-md-right">Confirm Password</Form.Label>
                                                <Col md={6}>
                                                  <Form.Control type="password" placeholder="Confirm Password" autoComplete="current-password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} isValid={touched.confirmPassword && !errors.confirmPassword} isInvalid={touched.confirmPassword && errors.confirmPassword}/>
                                                  <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row}>
                                              <Col md={{ span: 8, offset: 4 }}>
                                                <Button type="submit" disabled={this.isSubmitting}>Register</Button>
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

export default connect(mapStateToProps)(withRouter(RegistrationComponent));
