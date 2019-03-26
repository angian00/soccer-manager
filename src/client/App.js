import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';

export default class App extends Component {
  state = { leagueName: null };

  componentDidMount() {
    fetch('/api/league/1')
      .then(res => res.json())
      .then(league => this.setState({ leagueName: league.name }));
  }

  render() {
    const { leagueName } = this.state;
    return (
      <div>
        {leagueName ? <h1>{`Hello ${leagueName}`}</h1> : <h1>Loading.. please wait!</h1>}
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
