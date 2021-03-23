import { v4 as uuid } from 'uuid';
import * as _ from'lodash';

export interface ListData {
    added?: any,
    removed?: any,
    list: any[]
}

export type ListEventHandler = (data: ListData) => void;

export interface ListEventSubscription {
    subscriptionId: string,
    eventHandler: ListEventHandler
}

export interface ListSubscription {
    id: string;
    unsubscribeList: () => void;
}

export type ListSubscriptionData = {
    list: any[],
    subscriptions: Map<string, ListEventSubscription>
}

export const setList = (mapKey: string, newData: any | any[])  => {
    ListManager.setList(mapKey, newData);
}

export const subscribeList = (key: string, newEventHandler: ListEventHandler, triggerNow = false): ListSubscription => {
    return ListManager.subscribe(key, newEventHandler, triggerNow);
}

export const getList = (key: string): any[] | undefined => {
    return ListManager.getList(key);
}

export const clearList = (key: string) => {
    return ListManager.clearList(key);
}

export const removeFromList = (key: string, listItem: any | any[]) => {
    return ListManager.removeFromList(key, listItem);
}

class ListManager {

    private static map: Map<string, ListSubscriptionData> = new Map();    

    static setList(listKey: string, newData: any | any[]) {
        if (listKey) {
            let subData = this.map.get(listKey);  
            let dataAdded: any | any[];
            if (subData) {
                if (Array.isArray(newData)) {
                    dataAdded = newData.filter((item: any) => subData?.list.indexOf(item) === -1);
                    subData.list = subData.list.concat(dataAdded);
                } else {
                    dataAdded = subData.list.find(item => _.isEqual(item, newData));
                    if (!dataAdded) {
                        subData.list.push(newData);
                        dataAdded = newData;
                    } else {
                        dataAdded = null;
                    }                
                }                
            } else {
                subData = {
                    list: Array.isArray(newData) ? newData : [newData],
                    subscriptions: new Map()
                };
                this.map.set(listKey, subData);
            }

            if (dataAdded) {
                subData.subscriptions.forEach((eventSub: ListEventSubscription) => {
                    if (eventSub) {
                        if (subData) {
                            const eventData: ListData = {
                                removed: null,
                                added:  dataAdded,
                                list: _.cloneDeep(subData.list)
                            }
                            eventSub.eventHandler(eventData);
                        }
                    }
                });
            }            
        }
    }

    static removeFromList(key: string, delData: any | any[]) {
        const subsData = this.map.get(key);
        if (subsData?.list) {
            let toDelete: any | any[];
            if (Array.isArray(delData)) {
                toDelete = delData.filter(item => subsData.list.indexOf(item) > -1);
                if (toDelete && toDelete.length > 0) {
                    subsData.list = subsData.list.filter(item => !(toDelete.indexOf(item) > -1));
                }
                
            } else {
                toDelete = subsData.list.find((item: any) => _.isEqual(delData, item));
                if (toDelete) {
                    subsData.list = subsData.list.filter(item => !_.isEqual(item, toDelete));
                }
            }

            if (toDelete) {
                subsData.subscriptions.forEach((eventSub: ListEventSubscription) => {
                    if (eventSub) {
                        if (subsData) {
                            const eventData: ListData = {
                                removed: Array.isArray(toDelete) ? toDelete : [toDelete],
                                added:  null,
                                list: _.cloneDeep(subsData.list)
                            }
                            eventSub.eventHandler(eventData);
                        }
                    }
                });
            }
        }
    }

    static subscribe(key: string, newEventHandler: ListEventHandler, triggerNow = false): ListSubscription {
        const id = uuid();
        if (key && newEventHandler) {
            const subscriptionData = this.map.get(key);
            if (subscriptionData) {
                subscriptionData.subscriptions.set(id, { subscriptionId: id, eventHandler: newEventHandler });

                if (triggerNow) {
                    if (subscriptionData.list) {
                        const eventData: ListData = {
                            removed: undefined,
                            added:  undefined,
                            list: _.cloneDeep(subscriptionData.list)
                        }
                        newEventHandler(eventData);
                    }
                }
            } else {
                const subsData: ListSubscriptionData = {
                    list: [],
                    subscriptions: new Map().set(id, {subscriptionId: id, eventHandler: newEventHandler})
                };
                this.map.set(key, subsData);
            }
        }

        return { id, unsubscribeList: () => this.unsubscribeMap(key, id) };
    }

    static getList(key: string): any[] | undefined {
        const subsData = this.map.get(key);
        return subsData ? _.cloneDeep(subsData.list): undefined;
    }

    static unsubscribeMap(key: string, id: string): boolean {
        const subsData = this.map.get(key);
        return subsData ? subsData.subscriptions.delete(id) : false;
    }

    // static deleteListEntry(key: string, listItem: any) {
    //     const subsData: ListSubscriptionData | undefined = this.map.get(key);    
    //     const newList = subsData?.list.filter(item => item !== listItem);

    //     if (subsData) {
    //         subsData.list = newList ? newList : [];
    //     }        
 
    //     subsData?.subscriptions.forEach((eventSub: ListEventSubscription) => {
    //         if (eventSub) {
    //                 const eventData: ListData = {
    //                     removed: listItem,
    //                     added: null,
    //                     list: _.cloneDeep(newList ? newList : [])
    //                 }
    //                 eventSub.eventHandler(eventData);
    //             }
    //         }
    //     );
    // }

    static clearList(key: string) {
        return this.map.delete(key);
    }
}