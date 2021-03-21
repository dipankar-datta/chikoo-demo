import React, { Component } from 'react';
import Levels from './levels/levels';
import Rows from './rows/rows';

export default class ShelfDemo extends Component<any, any> {

    render() {
        return (
            <div>
                <Rows/>
                <br/>
                <Levels/>
            </div>
        );
    }
}