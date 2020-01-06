import React, { Component } from 'react';
import { match } from 'react-router-dom';

type Props = {
  hero: Record<any, any>;
  match: match<any> | null;
}


export class HeroPage extends Component<Props> {
  render() {
    return (
      <div>
        Hero Page { this.props.hero.name }
      </div>
    )
  }
}

export default HeroPage;
