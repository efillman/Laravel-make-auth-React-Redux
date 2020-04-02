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

import {getUserAPI, emailVerifyAPI, emailResendAPI} from "../api/apiURLs";
import {loginUser, logoutUser} from "../actions/authentication";
import {userInfoIn, userInfoOut} from "../actions/userInfo";

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
                //this.setState(() => ({isLoading: false, success: userInfo}));
                }
            )
            .catch((error) => {
                console.log(error.response);
                this.props.dispatch(userInfoOut());
                this.props.dispatch(logoutUser());
                this.props.history.push("/login");
            });

          if (this.props.userInfo.userActive !== null && this.props.userInfo.userActive !== 0) {
              this.props.history.push("/home");
          }

    };

    componentDidUpdate() {
      if (this.props.userInfo.userActive !== null && this.props.userInfo.userActive !== 0) {
          this.props.history.push("/home");
      }
    }

    componentDidMount() {
      this.setState(() => ({isLoading: true}));
      this.loadUserService();

      if (this.props.match.path === "/email/verify/:verifyid/:verifytoken") {
        if ((this.props.match.params.verifyid !== null) && (this.props.match.params.verifytoken !== null)) {
            // check password reset token
            const headers = {Accept: "application/json", Authorization: `Bearer ${this.props.authentication.accessToken}`};
            this.setState(() => ({isLoading: true}));

            //grap data from parameters
            const data = {
                id: this.props.match.params.verifyid,
                hash: this.props.match.params.verifytoken
            };

            axios.post(emailVerifyAPI, data, {headers}).then((response) => {
              const success = Object.values(response.data);
              this.setState(() => ({isLoading: false, success}));
              this.loadUserService();
            }).catch((error) => {
                const errors = Object.values(error.response.data);
                this.setState(() => ({isLoading: false, errors}));
            });
          }
        }
        this.setState(() => ({isLoading: false}));



    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState(() => ({isLoading: true}));

        const headers = {Accept: "application/json", Authorization: `Bearer ${this.props.authentication.accessToken}`};
        axios.get(emailResendAPI, {headers}).then((response) => {
          const success = Object.values(response.data);
          this.setState(() => ({isLoading: false, success}));
        }).catch((error) => {
            const errors = Object.values(error.response.data);
            this.setState(() => ({isLoading: false, errors}));
        });
    };

    render() {
        if (this.state.isLoading) {
            return <LoadingScreen/>
        }
        return (<Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8}>
                  <Card>
                      <Card.Header>Verify Your Email Address</Card.Header>
                      <Card.Body>
                        {this.state.errors.length > 0 &&
                          <div className="alert alert-danger">
                            <ul>
                            {this.state.errors.map((item, key) => {
                              return <li key={key}>{item}</li>
                            })}
                            </ul>
                          </div>
                        }
                        {this.state.success.length > 0 &&
                          <div className="alert alert-success">
                                <ul>
                                {this.state.success.map((item, key) => {
                                  return <li key={key}>{item}</li>
                                })}
                                </ul>
                          </div>
                              }
                        <div>Before proceeding, please check your email for a verification link. If you did not receive the email,
                        <Form noValidate="noValidate" onSubmit={this.handleSubmit}>
                      <Button type="submit" variant="link" className="p-0 m-0 align-baseline">click here to request another</Button>.
                        </Form>
                        </div>
                      </Card.Body>
                  </Card>
                </Col>
            </Row>
        </Container>);
    }

}

const mapStateToProps = (state) => {
    return {
        resetPassword: state.resetPassword,
        authentication: state.authentication,
        userInfo: state.userInfo
    };
};

export default connect(mapStateToProps)(withRouter(EmailVerifyComponent));
