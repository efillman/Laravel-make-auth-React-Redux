import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from "react-router-dom";
import {logoutUser} from "../actions/authentication";
import {userInfoOut} from "../actions/userInfo";
import {logoutAPI} from "../api/apiURLs";
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

class LogoutComponent extends React.Component{

    state = {
        logoutMessage: "Please wait while we safely log you out..."
    };

    componentDidMount(){
        if(this.props.authentication.accessToken !== ""){
            const headers = {
                Accept: "application/json",
                Authorization: `Bearer ${this.props.authentication.accessToken}`
            };
            axios.get(logoutAPI, {headers})
                .then(() => {
                    this.props.dispatch(userInfoOut());
                    this.props.dispatch(logoutUser());
                    this.props.history.push("/login");
                })
                .catch((error) => {
                    console.log(error.response);
                     this.setState(() => ({logoutMessage: "Something went wrong! Please try again."}))
                });

        }
        else{
            this.props.history.push("/login");
        }
    }

    render(){
        return (
          <Container className="">
              <Row className="justify-content-center">
                  <Col className="justify-content-center text-center" md={12}>
            {this.state.logoutMessage}
          </Col>
      </Row>
    </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authentication: state.authentication
    };
};

export default connect(mapStateToProps)(withRouter(LogoutComponent));
