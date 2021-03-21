import React, {Component} from 'react';
import { getData, setShelf, ShelfData, subscribe, Subscription } from '../../jatayu/shelf/shelf-manager';
import Updater from '../updater/updater';

export const TARGET_ROW_KEY = 'TARGET_KEY';

interface IRowsState {
    text: string,
    latestData: string
}

export default class Rows extends Component<any, IRowsState> {

    private subscription?: Subscription;

    constructor(props: any) {
        super(props);
        this.state = {text: 'Initial Text', latestData: ''};
    }

    componentDidMount() {        
        setShelf(TARGET_ROW_KEY, 'Hello Chikoo');

        if (!this.subscription) {
            this.subscription = subscribe(TARGET_ROW_KEY, (newData: ShelfData) => {
                this.setState({text: newData.current});
            }, true);
        }        
    }

    fetchLatestData = () => {
        this.setState({latestData: getData(TARGET_ROW_KEY).current});
    }


    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    render() {
        const tdStyle = {width: '200px'};
        const updateProps = {
            shelfKey: TARGET_ROW_KEY,
            initialText: 'Initi local text'
        };
        return (
            <div>
                <label style={{fontWeight: 'bold'}}>Rows Example</label><br/>
                <label style={{fontWeight: 'bold'}}>Target data: </label>{this.state.text}
                <table>
                    <tbody>
                        <tr>
                            {['One', 'Two', 'Three'].map((item: string, index: number) => {
                                return (
                                    <td style={tdStyle} key={index}>
                                        <label style={{fontWeight: 'bold'}}>{item}</label>
                                        <Updater {...updateProps}/>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>                    
                </table>
                <div style={{marginTop: '15px'}}>
                    <button onClick={this.fetchLatestData} >Get latest data</button>
                    <br/>
                    <label>{this.state.latestData}</label>
                </div>
            </div>
        );
    }
}