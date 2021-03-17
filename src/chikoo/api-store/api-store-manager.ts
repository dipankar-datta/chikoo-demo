import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';
import {
    SubscriptionData,
    EventSubscription,
    EventHandler,
    Subscription
} from '../store/store-manager';

export default class ApiStoreManager {

    private static storage: Map<string, SubscriptionData> = new Map();

    static setStore(key: string, url: string, headers?: { [key: string]: string }) {
        if (key && url) {
            fetch(url, { method: 'GET', headers })
                .then((response: Response) => {
                    response
                        .json()
                        .then((data: any) => {
                            let store = this.storage.get(key);
                            if (store) {
                                store.data.previous = _.cloneDeep(store.data.current);
                                store.data.current = data;
                            } else {
                                store = {
                                    data: {
                                        key, current: data,
                                        previous: null
                                    },
                                    subscriptions: new Map()
                                };
                                this.storage.set(key, store);
                            }

                            store.subscriptions.forEach((eventSub: EventSubscription, key: string) => {
                                if (eventSub) {
                                    if (store) {
                                        eventSub.eventHandler(data);
                                    }
                                }
                            });
                        })
                        .catch(console.error);
                })
                .catch(console.error);
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