import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Container, Row, Col, Card} from 'react-bootstrap';

export default class WelcomeComponent extends Component {
    render() {
        return (
          <Container className="py-4">
            <Row className="justify-content-center">
                <Col md="8">
                    <Card>
                        <Card.Header>Welcome Component</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                Welcome Component
                            </Card.Title>
                            <Card.Text>
                                Welcome Component
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
      );
    }
}
