// @flow
import React from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';

import SlideController from './components/Remote';
import PointerController from './components/PointerController';
import {ReactComponent as Islide} from './icons/iSlide_bleu.svg';

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
  isPointerDisplayed: boolean,
};

class App extends React.Component<*, State> {
  state = {
    alpha: null,
    beta: null,
    gamma: null,
    initialOffset: null,
    currentIndex: 0,
    isPointerDisplayed: false,
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

  displayPointer = (display: boolean) => {
    this.socket.emit('displayPointer', {
      display: display,
    });
    this.setState({
      isPointerDisplayed: display,
    });
  };

  render() {
    const {currentIndex} = this.state;
    return (
      <div className="App">
        <SlideController
          requestIndex={this.requestIndex}
          currentIndex={currentIndex}
        />
        <PointerController displayPointer={this.displayPointer} />
        <Islide/>
      </div>
    );
  }
}

export default App;
