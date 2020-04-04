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

import {getUserAPI, registerAPI, passwordRequestAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";

import LoadingScreen from "../components/LoadingScreen";
import * as yup from 'yup'; // for everything
import {Formik} from 'formik';

const s = "success";

class PasswordRequestComponent extends React.Component {

    state = {
        isLoading: false,
        errors: [],
        success: []
    };

    componentDidMount() {}

    handleSubmit = (values, {
        props = this.props,
        setSubmitting
    }) => {

        this.setState(() => ({isLoading: true}));
        const data = {
            email: values.email
        };

        axios.post(passwordRequestAPI, data).then((response) => {
            const success = Object.values(response.data);
            this.setState(() => ({isLoading: false, success}));
        }).catch((error) => {
            const errors = Object.values(error.response.data);
            this.setState(() => ({isLoading: false, errors}));
        });
    };

    schema = yup.object().shape({email: yup.string().email().required()});

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
                                    email: ''
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
                                        <Form.Group as={Row} controlId="validationEmail">
                                            <Form.Label column="column" md="4" className="text-md-right">E-Mail Address</Form.Label>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="Email" autoComplete="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={touched.email && errors.email}/>
                                                <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Col md={{
                                                    span: 8,
                                                    offset: 4
                                                }}>
                                                <Button type="submit" className="btn btn-primary" disabled={this.isSubmitting}>Send Password Reset Link</Button>
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
    return {userInfo: state.userInfo, authentication: state.authentication};
};

export default connect(mapStateToProps)(withRouter(PasswordRequestComponent));
