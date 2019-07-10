// @flow
import React from 'react';

export type SliderType = {
  id: string,
  url: string,
};

type State = {
  isSuccess: boolean,
  isFetching: boolean,
  isFailure: boolean,
  sliders: ?Array<SliderType>,
};

type Props = {
  children: Function,
};

class SliderApi extends React.Component<Props, State> {
  state = {
    isSuccess: true,
    isFetching: true,
    isFailure: false,
    sliders: null,
  };

  componentDidMount() {
    fetch('/slides')
      .then(res => res.json())
      .then(data => {
        this.setState({isFetching: false, sliders: data});
      });
  }

  render() {
    const {isSuccess, isFetching, isFailure, sliders} = this.state;
    if (isFetching) return null;
    if (isFailure) return null;

    return isSuccess && this.props.children(sliders);
  }
}

export default SliderApi;
