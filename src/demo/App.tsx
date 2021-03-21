import React, { Component } from 'react';
import Levels from './levels/levels';
import { MapDemo } from './map-demo';
import Rows from './rows/rows';

interface IAppState {
  category: 'shelf' | 'map';
}

export default class App extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {category: 'shelf'};
  }

  onCategoryClickHandler = (ev: any) => {
    this.setState({category: ev.target.value});
  }

  render() {
    return (
      
      <div style={{display: 'table', margin: 'auto'}}>
        <h2>Chikoo Demo</h2> 
         <input name='category' onClick={this.onCategoryClickHandler} checked={this.state.category === 'shelf'} value='shelf' type="radio"/> <label style={{paddingRight: '15px'}}>Shelf</label>
        <input name='category' onClick={this.onCategoryClickHandler} checked={this.state.category === 'map'} value='map' type="radio"/> <label style={{paddingRight: '15px'}}>Map</label>
        
       
        {this.state.category === 'shelf' ? 
        (  
          <div>   
          <Rows/>
          <br/>
          <Levels/>
          </div>  
        )
        :
        (
          <MapDemo/>
        )
      }
      </div>
    );
  }
}
