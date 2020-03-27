import React from 'react';
import {Spinner} from 'react-bootstrap';

const LoadingScreen = () => (
  <Spinner animation="border" role="status">
    <span className="sr-only">Loading...</span>
</Spinner>
);

export default LoadingScreen;
