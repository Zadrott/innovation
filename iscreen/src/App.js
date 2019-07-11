import React from 'react';
import './App.css';
import styled from '@emotion/styled';
import socketIOClient from 'socket.io-client';

import SliderApi from './containers/SliderApi';
import Slider from './components/Slider';
import Message from './components/Message';
import Monitoring from './components/Monitoring';

class App extends React.Component {
  state = {
    alpha: null,
    beta: null,
    gamma: null,
    x: 20,
    y: 20,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    hasWindowResized: false,
    screenWidth: 0,
    screenHeight: 0,
    slideIndex: 0,
    questions: [],
  };

  screenRef = React.createRef();
  endpoint = '/screen';
  socket = socketIOClient(this.endpoint);

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    this.socket.on('position', data => {
      const {alpha, beta, gamma, x, y} = data;
      this.setState({alpha, beta, gamma, x, y});
    });

    this.socket.on('questions', data => {
      console.log(data);
      this.setState({questions: data});
    });

    this.socket.on('slideIndex', data => {
      this.setState({slideIndex: data});
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateScreenDimensions = () => {
    const {
      current: {clientHeight, clientWidth},
    } = this.screenRef;

    this.setState({
      screenWidth: clientWidth,
      screenHeight: clientHeight,
    });
  };

  updateWindowDimensions = () => {
    this.setState(
      {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
      },
      () => this.updateScreenDimensions(),
    );
  };

  renderSlider = (slides, slideIndex, questions) => {
    const slidesWithoutQuestions = slides.map(slide => (
      <Slide key={slide} slideBackground={slide} />
    ));
    const questionsSlides = questions.map(question => (
      <Slide key={question.message}>
        <span>{question.message}</span>
      </Slide>
    ));
    const slidesWithQuestions = [...slidesWithoutQuestions, ...questionsSlides];
    return <Slider index={slideIndex} slides={slidesWithQuestions} />;
  };

  renderScreen = (slideIndex, i_x, i_y, questions) => {
    return (
      <Screen ref={this.screenRef}>
        <Cursor x={i_x} y={i_y} />
        <SliderApi>
          {slides => this.renderSlider(slides, slideIndex, questions)}
        </SliderApi>
      </Screen>
    );
  };

  renderMessage = () => (
    <Message
      sendMessage={message => {
        console.log(message);
        this.socket.emit('message', {message: message});
      }}
    />
  );

  renderMonitoring = (alpha, beta, gamma, x, y) => {
    return <Monitoring infos={{alpha, beta, gamma, x, y}}></Monitoring>;
  };

  render() {
    const {
      alpha,
      beta,
      gamma,
      x,
      y,
      screenWidth,
      screenHeight,
      slideIndex,
      questions,
    } = this.state;
    const i_x = (screenWidth * x) / 200 + screenWidth / 2;
    const i_y = (screenHeight * y) / 200 + screenHeight / 2;

    return (
      <RootStyled>
        {this.renderScreen(slideIndex, i_x, i_y, questions)}
        {this.renderMonitoring(alpha, beta, gamma, x, y)}
        {this.renderMessage()}
      </RootStyled>
    );
  }
}

const Slide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-size: cover;
  background-image: url(${props => props.slideBackground});
`;

const Cursor = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: red;
  border-radius: 100%;
  user-select: none;
  transform: ${props => `translate3d(${props.x}px,${props.y}px,0)`};
`;

const Screen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  width: calc(100% - 80px);
  height: calc(100% - 80px);

  border: 4px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
`;

const RootStyled = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default App;
