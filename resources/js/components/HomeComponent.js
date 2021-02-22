import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {withRouter, Link} from 'react-router-dom';
import {Container, Row, Col, Card} from 'react-bootstrap';
import {loginAPI, getUserAPI} from "../api/apiURLs";

class HomeComponent extends React.Component {

    state = {
        userInfo: [],
        errors: []
    };

    componentDidMount(){
      axios.get(getUserAPI)
          .then((response) => {
            const userInfo = response.data;
            this.setState(() => ({userInfo: userInfo}));
          })
          .catch((error) => {
            this.setState(() => ({errors: error}));
          });
    }

    render() {
        return (
          <Container className="py-4">
            <Row className="justify-content-center">
                <Col md="8">
                    <Card>
                        <Card.Header>Home Component</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                Home Component
                            </Card.Title>
                            <Card.Text>
                                Home Component
                                {this.state.userInfo.length > 0 &&
                                    <ul>
                                    {this.state.userInfo.map((item, key) => {
                                      return <li key={key}>{item}</li>
                                    })}
                                    </ul>
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
      );
    }
}

export default (withRouter(HomeComponent));
