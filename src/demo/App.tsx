import React, { Component } from 'react';
import Levels from './levels/levels';
import Rows from './rows/rows';

export default class App extends Component {

  render() {
    return (
      <div style={{display: 'table', margin: 'auto'}}>
        <h2>Chikoo Demo</h2>      
        <Rows/>
        <br/>
        <Levels/>
      </div>      
    );
  }
}
