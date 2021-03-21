import React, {Component} from 'react';
import { setShelf, ShelfData, subscribe, Subscription, SubscriptionData } from '../../jatayu';
import '../App.css';
import Updater from '../updater/updater';

export const TARGET_LEVEL_KEY = 'TARGET_LEVEL_KEY';

export default class Levels extends Component<any, any> {

    private subscription?: Subscription;

    constructor(props: any) {
        super(props);
        this.state = {text: ''};
    }

    componentDidMount() {
        setShelf(TARGET_LEVEL_KEY, 'Initial Level');
        if (!this.subscription) {
            subscribe(TARGET_LEVEL_KEY, (data: ShelfData) => { 
                this.setState({text: data.current});
            }, true);
        }
    }

    render() {
        return (
            <div className='levels-div'>
                <h3>This is Levels Example</h3>
                <label style={{fontWeight: 'bold'}}>Target data: </label>{this.state.text}
                <FirstLevel/>
            </div>
        );
    }
}

export const FirstLevel = (props: any) => {
    return (
        <div className='levels-div'>
            <label>Level One</label>
            <Updater shelfKey={TARGET_LEVEL_KEY}/>
            <SecondLevel/>

        </div>
    );
};

export const SecondLevel = (props: any) => {
    return (
        <div className='levels-div'>
            <label>Level Two</label>
            <Updater shelfKey={TARGET_LEVEL_KEY}/>
            <ThirdLevel/>
        </div>
    );
};

export const ThirdLevel = (props: any) => {
    return (
        <div className='levels-div'>
            <label>Level Three</label>
            <Updater shelfKey={TARGET_LEVEL_KEY}/>
        </div>
    );
};