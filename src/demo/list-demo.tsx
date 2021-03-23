import {Component} from 'react';
import { removeFromList, ListData, ListSubscription, setList, subscribeList } from '../jatayu';

const LIST_TARGET_KEY = 'LIST_TARGET_KEY';

interface IListDemoState {
    displayData: string;
}

export class ListDemo extends Component<any, IListDemoState> {

    constructor(props: any) {
        super(props);
        this.state = {
            displayData: ''
        };
    }

    private listSubs?: ListSubscription;

    componentDidMount() {        
        if (!this.listSubs) {
            this.listSubs = subscribeList(LIST_TARGET_KEY, (listData: ListData) => {
                console.log('Data: ', listData);
                this.setState({displayData: listData.list.join(',')});
            });
        }
        setList(LIST_TARGET_KEY, '100');
    }

    componentWillUnmount() {
        if (this.listSubs) {
            this.listSubs.unsubscribeList();
        }
    }

    render() {       
        return (
            <div>
                <label style={{fontWeight: 'bold'}}>Main List Data: </label> {this.state.displayData}
                <br/><br/>
                <div><ListUpdater/></div>
                <br/><br/>
                <div><ListUpdater/></div>
            </div>
        );
    }

}

interface IListUpdaterState {
    displayData: string,
    listItem: string
}
export class ListUpdater extends Component<any, IListUpdaterState> {

    private listSubs?: ListSubscription;

    constructor(props: any) {
        super(props);
        this.state = {
            displayData: '',
            listItem: ''
        };
    }
    componentDidMount() {
        if (!this.listSubs) {
            this.listSubs = subscribeList(LIST_TARGET_KEY, (listData: ListData) => {
                console.log('ListUpdater: ', listData);
                this.setState({displayData: listData.list.join(',')});               
            });
        }
    }

    componentWillUnmount() {
        if (this.listSubs) {
            this.listSubs.unsubscribeList();
        }
    }

    keyChangeHandler = (ev: any) => {
        this.setState({listItem: ev.target.value});
    }

    setHandler = () => {

        let target: any;

        if (this.state.listItem.indexOf('{') === 0 && this.state.listItem.indexOf('}') > -1) {
            target = JSON.parse(this.state.listItem);
        } else {
            target = this.state.listItem.indexOf(',') > -1 ? this.state.listItem.split(','): this.state.listItem;
        }
        
        setList(LIST_TARGET_KEY, target);
    }

    removeHandler = () => {
        const target = this.state.listItem.indexOf(',') > -1 ? this.state.listItem.split(','): this.state.listItem;
        removeFromList(LIST_TARGET_KEY, target);
    }

    unsubscribeHandler = () => {

    }

    render() {
        return (
            <div style={{border: '1px solid red', padding: '10px'}}>
                <label style={{fontWeight: 'bold'}}>Map Data: </label> {this.state.displayData}
                <br/><br/>
                <label>Item: </label><input onChange={this.keyChangeHandler} value={this.state.listItem} name='key' type="text"/>&nbsp;&nbsp;
                <br/>&nbsp;<br/>
                <div style={{margin: 'auto', display: 'table'}}>
                    <button onClick={this.setHandler}>Set</button>
                    &nbsp;&nbsp;
                    <button onClick={this.removeHandler} >Delete</button>
                </div>
            </div>
        );
    }

}