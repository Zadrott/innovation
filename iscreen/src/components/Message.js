// @flow
import React from 'react';
import styled from '@emotion/styled';
import questionMark from '../assets/help.svg';

const colors = {
  green: 'rgb( 3, 178, 141 )',
  gray: 'rgb( 90, 90, 90 )',
  white: 'white',
};

type Props = {
  sendMessage: (message: string) => void,
};

type State = {
  message: string,
  questions: Array<string>,
  isOpen: boolean,
};

class Message extends React.Component<Props, State> {
  state = {
    message: '',
    questions: [],
    isOpen: false,
  };

  handleInput = e => {
    this.setState({
      message: e.target.value,
    });
  };

  handleSendMessage = (message: string) => {
    this.props.sendMessage(message);
    this.setState(
      prevState => ({
        questions: [...prevState.questions, message],
      }),
      () => this.setState({message: ''}),
    );
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleSendMessage(this.state.message);
    }
  };

  renderHeader = () => {
    const infos = `Poser une question`;
    return (
      <Header
        onClick={() =>
          this.setState(prevState => ({isOpen: !prevState.isOpen}))
        }>
        <Infos>{infos}</Infos>
        <Icon>
          <QuestionIcon />
        </Icon>
      </Header>
    );
  };

  renderMain = (questions: Array<string>) => {
    return (
      <Main>
        <Questions>
          {questions.map((question, index) => (
            <Question key={index.toString()}>{question}</Question>
          ))}
        </Questions>
      </Main>
    );
  };

  renderFooter = (message: string) => {
    return (
      <Footer>
        <Container>
          <Input
            value={message}
            placeholder={'Posez moi une question'}
            onChange={this.handleInput}
            onKeyPress={this.handleKeyPress}
          />
          <SendButton onClick={() => this.handleSendMessage(message)} />
        </Container>
        <NChar>{`${message.length} caractères`}</NChar>
      </Footer>
    );
  };

  render() {
    const {message, questions, isOpen} = this.state;
    return (
      <RootStyled isOpen={isOpen}>
        {this.renderHeader()}
        {this.renderMain(questions)}
        {this.renderFooter(message)}
      </RootStyled>
    );
  }
}

const Questions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const Question = styled.div``;

const Input = styled.input`
  flex: 1;
  margin-right: 8px;
  padding: 8px;
`;

const Infos = styled.div`
  color: ${colors.white};
  padding: 8px;
  // margin: 8px;
`;

const SendButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${colors.green};
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  padding: 8px;
`;

const NChar = styled.div`
  padding: 8px;
`;

const HEADER_HEIGHT = 50;

const Header = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  height: ${HEADER_HEIGHT}px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: ${colors.green};

  cursor: pointer;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: rgba(250, 250, 250, 0.8);
`;

const Footer = styled.div`
  height: 90px;
  background: rgba(250, 250, 250, 0.8);
`;

const QuestionIcon = props => (
  <img
    alt="question"
    src={questionMark}
    width="40"
    height="40"
    style={{color: 'white'}}
  />
);

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: -30px;
  right: 18px;
  z-index: 999;

  width: 60px;
  height: 60px;

  background: ${colors.green};

  border-radius: 100%;
  user-select: none;
`;

const MESSAGE_HEIGHT = 300;

const RootStyled = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  z-index: 999;
  bottom: ${props => (props.isOpen ? 0 : -(MESSAGE_HEIGHT - HEADER_HEIGHT))}px;
  right: 0;

  width: 300px;
  height: ${MESSAGE_HEIGHT}px;

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: bottom 0.35s ease-in-out;
`;

export default Message;
