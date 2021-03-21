import { v4 as uuid } from 'uuid';
import * as _ from'lodash';

export interface MapData {
    key?: string,
    current?: any,
    previous?: any,
    map: Map<any, any>    
}

export type EventHandler = (data: MapData) => void;

export interface MapEventSubscription {
    subscriptionId: string,
    eventHandler: EventHandler
}

export interface MapSubscription {
    id: string;
    unsubscribe: () => void;
}

export type MapSubscriptionData = {
    map: Map<any, any>,
    subscriptions: Map<string, MapEventSubscription>
}

class MapManager {

    private static map: Map<string, MapSubscriptionData> = new Map();    

    static setMap(mapKey: string, objKey: any, newData: any) {
        if (mapKey) {
            let subData = this.map.get(mapKey);
            const newDataClone = _.cloneDeep(newData);
            let prevData: any = undefined;
            if (subData) {
                prevData = subData.map.get(objKey);
                subData.map.set(objKey, newDataClone);
            } else {
                subData = {
                    map: new Map().set(objKey, newData),
                    subscriptions: new Map()
                };
                this.map.set(mapKey, subData);
            }            

            subData.subscriptions.forEach((eventSub: MapEventSubscription) => {
                if (eventSub) {
                    if (subData) {
                        const eventData: MapData = {
                            key: objKey,
                            current: newDataClone,
                            previous:  _.cloneDeep(prevData),
                            map: _.cloneDeep(subData.map)
                        }
                        eventSub.eventHandler(eventData);
                    }
                }
            });
        }
    }

    static subscribe(key: string, newEventHandler: EventHandler, triggerNow = false): MapSubscription {
        const id = uuid();
        if (key && newEventHandler) {
            const subscriptionData = this.map.get(key);
            if (subscriptionData) {
                subscriptionData.subscriptions.set(id, { subscriptionId: id, eventHandler: newEventHandler });

                if (triggerNow) {
                    if (subscriptionData.map) {
                        const eventData: MapData = {
                            key: undefined,
                            current: undefined,
                            previous:  undefined,
                            map: _.cloneDeep(subscriptionData.map)
                        }
                        newEventHandler(eventData);
                    }
                }
            } else {
                const subsData: MapSubscriptionData = {
                    map: new Map(),
                    subscriptions: new Map()
                };
                subsData.subscriptions.set(id, {subscriptionId: id, eventHandler: newEventHandler});
                this.map.set(key, subsData);
            }
        }

        return { id, unsubscribe: () => this.unsubscribe(key, id) };
    }

    static getMap(key: string): any {
        const subsData = this.map.get(key);
        return subsData ? { ...subsData.map } : null;
    }

    static unsubscribe(key: string, id: string): boolean {
        const subsData = this.map.get(key);
        return subsData ? subsData.subscriptions.delete(id) : false;
    }
}