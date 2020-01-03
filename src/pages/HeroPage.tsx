import React, { Component } from 'react';
import { match } from 'react-router-dom';
import { callSheet } from '../utils/sheets';

type Props = {
  globalData: Record<any, any>;
  match: match<any> | null;
}

type State = {
  hero: Record<any, any> | null;
};

export class HeroPage extends Component<Props, State> {
  state = {
    hero: null
  };

  componentDidMount() {
    const { hero = '' } = (this.props.match || {}).params;
    callSheet(this.props.globalData[hero], 'data').then((hero) => {
      this.setState({ hero });
    });
  }

  render() {
    console.log(this.state.hero);

    return (
      <div>
        Hero Page
      </div>
    )
  }
}

export default HeroPage;
