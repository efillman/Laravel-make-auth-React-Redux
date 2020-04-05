import React from 'react';
import {Spinner} from 'react-bootstrap';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

const LoadingScreen = () => (
  <Container className="">
      <Row className="justify-content-center">
          <Col className="justify-content-center text-center" md={12}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
      </Row>
    </Container>
);

export default LoadingScreen;
