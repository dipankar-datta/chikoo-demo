import { v4 as uuid } from 'uuid';
import * as _ from'lodash';

export interface StorageData {
    key: string,
    current: any,
    previous: any
}

export type EventHandler = (data: StorageData) => void;

export interface EventSubscription {
    subscriptionId: string,
    eventHandler: EventHandler
}

export interface Subscription {
    id: string;
    unsubscribe: () => void;
}

export type SubscriptionData = {
    data: StorageData,
    subscriptions: Map<string, EventSubscription>
}

export default class StorageManager {

    private static storage: Map<string, SubscriptionData> = new Map();

    static setStore(key: string, newData: any) {
        if (key) {
            let store = this.storage.get(key);
            const newDataClone = _.cloneDeep(newData);
            if (store) {
                store.data.previous = _.cloneDeep(store.data.current);
                store.data.current = newDataClone;
            } else {
                store = {
                    data: {
                        key, current: newDataClone,
                        previous: null
                    },
                    subscriptions: new Map()
                };
                this.storage.set(key, store);
            }            

            store.subscriptions.forEach((eventSub: EventSubscription, key: string) => {
                if (eventSub) {
                    if (store) {
                        eventSub.eventHandler(newDataClone);
                    }
                }
            });
        }
    }

    static subscribe(key: string, newEventHandler: EventHandler, triggerNow = false): Subscription {
        const id = uuid();
        if (key && newEventHandler) {
            const subscriptionData = this.storage.get(key);
            if (subscriptionData) {
                subscriptionData.subscriptions.set(id, { subscriptionId: id, eventHandler: newEventHandler });

                if (triggerNow) {
                    if (subscriptionData.data) {
                        newEventHandler(_.cloneDeep(subscriptionData.data));
                    }
                }
            }
        }

        return { id, unsubscribe: () => this.unsubscribe(key, id) };
    }

    static getData(key: string): any {
        const subsData = this.storage.get(key);
        return subsData ? { ...subsData.data } : null;
    }

    static unsubscribe(key: string, id: string): boolean {
        const subsData = this.storage.get(key);
        return subsData ? subsData.subscriptions.delete(id) : false;
    }
}