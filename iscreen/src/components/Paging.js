// @flow

import React from 'react';
import styled from '@emotion/styled';

type Props = {
  nSlides: number,
  currentIndex: number,
};

class Paging extends React.Component<Props> {
  render() {
    const {currentIndex, nSlides} = this.props;
    return <RootStyled>{`${currentIndex + 1} / ${nSlides}`}</RootStyled>;
  }
}

const RootStyled = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;
  top: 140px;
  right: 30px;
  width: 100px;
  text-align:center;

  padding: 4px;

  color: white;
  background: rgba(0, 0, 0, 0.6);
  font-size: small;
`;

export default Paging;
