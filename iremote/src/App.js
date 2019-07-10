// @flow
import React from 'react';
import './App.css';
import styled from '@emotion/styled';
import socketIOClient from 'socket.io-client';

import Remote from './components/Remote';

type DeviceOrientationEvent = {
  alpha: number,
  beta: number,
  gamma: number,
  absolute: boolean,
};

type State = {
  alpha: ?number,
  beta: ?number,
  gamma: ?number,
  currentIndex: number,
};

class App extends React.Component<*, State> {
  state = {
    alpha: null,
    beta: null,
    gamma: null,
    initialOffset: null,
    currentIndex: 0,
  };

  initialOffset: ?number = null;
  endpoint = '/remote';
  socket = socketIOClient(this.endpoint);

  componentDidMount() {
    window.addEventListener('deviceorientation', this.handleOrientation);
    this.socket.emit('slideIndex', {
      index: 0,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('deviceorientation', this.handleOrientation);
  }

  handleOrientation = (event: DeviceOrientationEvent) => {
    let {alpha} = event;
    const {beta, gamma, absolute} = event;
    const orientationIsWorldBased = absolute;

    if (orientationIsWorldBased) {
      if (this.initialOffset == null) {
        this.initialOffset = event.alpha;
      }
      alpha = event.alpha - this.initialOffset;
      if (alpha < 0) {
        alpha += 360;
      }
    }

    this.socket.emit('position', {
      alpha: alpha.toFixed(2),
      beta: beta.toFixed(2),
      gamma: gamma.toFixed(2),
    });

    this.setState({
      alpha,
      beta,
      gamma,
    });
  };

  requestIndex = (index: number) => {
    this.setState({
      currentIndex: index,
    });
    this.socket.emit('slideIndex', {
      index: index,
    });
  };

  render() {
    const {alpha, beta, gamma, currentIndex} = this.state;
    return (
      <RootStyled>
        <Remote requestIndex={this.requestIndex} currentIndex={currentIndex} />
        <Container>
          <span>alpha: {alpha && alpha.toFixed(2)}</span>
          <span>beta: {beta && beta.toFixed(2)}</span>
          <span>gamma: {gamma && gamma.toFixed(2)}</span>
        </Container>
      </RootStyled>
    );
  }
}

const RootStyled = styled.div`
  height: 100%;
  text-align: center;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export default App;
