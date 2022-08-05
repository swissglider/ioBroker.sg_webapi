/*
 * Created with @iobroker/create-adapter v2.1.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import { getFullSimpleDeviceList } from './nestjs/iobroker/services/miio-service';
import { UrlNotificationSubscriptionServiceListener } from './nestjs/iobroker/services/url-notification-subscription-service';
import bootstrap from './nestjs/main';

// Load your modules here, e.g.:
// import * as fs from "fs";

let MIOO_intervall: ioBroker.Interval;

class SgWebapi extends utils.Adapter {
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'sg_webapi',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        this.log.warn('onReady1');
        bootstrap(this);
        if (this.config.MIIO_autoRefresh) {
            getFullSimpleDeviceList();
            MIOO_intervall = this.setInterval(() => {
                getFullSimpleDeviceList();
            }, this.config['MIIO_autoRefreshTimeout'] ?? 50000);
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private async onUnload(callback: () => void): Promise<void> {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
            this.clearInterval(MIOO_intervall);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        // if (state) {
        //     // The state was changed
        //     this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        // } else {
        //     // The state was deleted
        //     this.log.info(`state ${id} deleted`);
        // }
        const operation = state ? 'change' : 'deletion';
        UrlNotificationSubscriptionServiceListener.listen(id, state, operation);
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever
    //             this.log.info('send command');

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new SgWebapi(options);
} else {
    // otherwise start the instance directly
    (() => new SgWebapi())();
}
