// @flow

import * as React from 'react';
import styled from '@emotion/styled';

import Paging from './Paging';

type ReactElement = React.Element;

type Props = {
  slides: Array<ReactElement>,
  index: number,
};

class Slider extends React.Component<Props> {
  renderSlides = (slides: Array<ReactElement>) => {
    const slideWidth = 100 / slides.length;
    return slides.map((slide, index) => (
      <Slide slideWidth={slideWidth} key={index.toString()}>
        {slide}
      </Slide>
    ));
  };

  renderPaging = (currentIndex, nSlides) => (
    <Paging currentIndex={currentIndex} nSlides={nSlides} />
  );

  render() {
    const {slides, index} = this.props;
    const nSlides = slides.length;
    return (
      <RootStyled>
        <Scene index={index} sliderWidth={nSlides * 100}>
          {this.renderSlides(slides)}
        </Scene>
        {this.renderPaging(index, nSlides)}
      </RootStyled>
    );
  }
}

const Slide = styled.div`
  height: 100%;
  width: ${props => props.slideWidth}%;
  margin: 4px;
`;

const Scene = styled.div`
	position: relative;
	left: ${props => -props.index * 100}%;
	display: flex;
	justify-content: center;
	align-items: center;
  width: ${props => props.sliderWidth}%;
	height: 100%;

	transition: left 0.5s ease-in-out;
  // transform: ${props => `translate3d(${props.x}px,${props.y}px,0)`};
`;

const RootStyled = styled.div`
  position: relative;
  z-index: 0;

  height: 100%;
  width: 100%;
  paddin-top: 75%;
`;

export default Slider;
