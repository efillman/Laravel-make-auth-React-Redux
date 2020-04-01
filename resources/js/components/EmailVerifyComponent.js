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

import {getUserAPI, registerAPI, emailVerifyAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";
import {resetInUser, resetOutUser} from "../actions/resetPassword";
import {ACCESS_TOKEN} from "../api/strings";

import LoadingScreen from "../components/LoadingScreen";
import * as yup from 'yup'; // for everything
import {Formik} from 'formik';

const s = "success";

class EmailVerifyComponent extends React.Component {

    state = {
        isLoading: false,
        errors: [],
        success: []
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
                }
            )
            .catch((error) => {
                console.log(error.response);
                this.props.dispatch(userInfoOut());
                this.props.dispatch(logoutUser());
                this.props.history.push("/login");
            });
    };

    componentDidMount() {
      this.setState(() => ({isLoading: true}));
      this.loadUserService();


        if ((this.props.match.params.verifyid !== null) && (this.props.match.params.verifytoken !== null)) {
            // check password reset token
            this.setState(() => ({isLoading: true}));
            const verify_id = this.props.match.params.verifyid;
            const verify_token = this.props.match.params.verifytoken;

            const headers = {Accept: "application/json", Authorization: `Bearer ${this.props.authentication.accessToken}`};
            axios.post(emailVerifyAPI + '/' + verify_id + '/' + verify_token, {headers})

            .then((response) => {
                  const success = Object.values(response.data)
                  this.setState(() => ({isLoading: false, success}));
                  this.props.history.push("/home");
              })
          .catch((error) => {
                const errors = Object.values(error.response.data);
                this.setState(() => ({isLoading: false, errors}));
            });
        }
    }

    //TODO change this to submit to the request password reset api
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

    schema = yup.object().shape({
        email: yup.string().email().required()
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
                          <Card.Header>Error</Card.Header>
                          <Card.Body>
                            <ul>
                            {this.state.errors.map((item, key) => {
                              return <li key={key}>{item}</li>
                            })}
                            </ul>
                          </Card.Body>
                      </Card>
                    }
                    {this.state.success.length > 0 &&
                      <Card bg="success" text="white">
                          <Card.Header>Valid Token</Card.Header>
                          <Card.Body>
                            <ul>
                            {this.state.success.map((item, key) => {
                              return <li key={key}>{item}</li>
                            })}
                            </ul>
                          </Card.Body>
                      </Card>
                    }

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

export default connect(mapStateToProps)(withRouter(EmailVerifyComponent));
