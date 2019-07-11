// @flow

import React from 'react';
import styled from '@emotion/styled';

type Props = {
  infos: {
    alpha: number,
    beta: number,
    gamma: number,
    x: number,
    y: number,
  },
};

class Monitoring extends React.Component<Props> {
  render() {
    const {alpha, beta, gamma, x, y} = this.props.infos;
    return (
      <RootStyled>
        <span>alpha: {alpha}</span>
        <span>beta: {beta}</span>
        <span>gamma: {gamma}</span>
        <span>x: {x.toFixed(2)}</span>
        <span>y: {y.toFixed(2)}</span>
      </RootStyled>
    );
  }
}

const RootStyled = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  width: 84px;
  padding: 4px;
  right: 10px;
  width: 100px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  font-size: small;
`;

export default Monitoring;
