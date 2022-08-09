import { HttpService } from '@nestjs/axios';
import { BadRequestException, GatewayTimeoutException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AdapterStr, DEFAULT_TIMEOUT } from '../../main';
import { Result } from '../interfaces/result.interface';

const _URL_SUBSCRIPTION: Record<string, string[]> = {};
const httpService = new HttpService();

export class AddURLNotification_DTO {
    @IsNotEmpty()
    @IsString()
    stateID!: string;

    @IsNotEmpty()
    @IsArray()
    urls!: string[];

    @IsOptional()
    @IsNumber()
    timeout?: number;

    @IsOptional()
    @IsBoolean()
    forceOverwritte?: boolean;
}

export class DeleteURLNotification_DTO {
    @IsNotEmpty()
    @IsArray()
    stateID!: string;

    @IsNotEmpty()
    @IsArray()
    urls!: string[];

    @IsOptional()
    @IsNumber()
    timeout?: number;
}

export const listen = async (
    id: string,
    state: ioBroker.State | null | undefined,
    operation: 'change' | 'deletion',
): Promise<void> => {
    if (operation === 'deletion') {
    } else {
        if (_URL_SUBSCRIPTION.hasOwnProperty(id)) {
            for (const url of _URL_SUBSCRIPTION[id]) {
                try {
                    await httpService.axiosRef.post(url, { id: id, state: state });
                } catch (error) {
                    AdapterStr.adapter?.log.error(`${error} - url: ${url}`);
                }
            }
        }
    }
};

export const UrlNotificationSubscriptionServiceListener = {
    listen: listen,
};

@Injectable()
export class URLNotificationSubscriptionService {
    /**
     * adds the stateID and the urls to existing ones or creates it
     * @param AddURLNotification_DTO
     * @returns Result Promise with {result: _URL_SUBSCRIPTION {}}
     */
    public addURLNotificationSubscription = async ({
        stateID,
        urls,
        timeout = DEFAULT_TIMEOUT,
        forceOverwritte = false,
    }: AddURLNotification_DTO): Promise<Result> => {
        AdapterStr.adapter?.log.silly('URLNotificationSubscriptionService');

        const adapter = AdapterStr.adapter;
        if (!adapter) throw new InternalServerErrorException('ioBroker adapter not set ??');

        // check if stateID is availavle
        const a = await adapter.getForeignStateAsync(stateID);
        if (!a) throw new BadRequestException(`the stateID: ${stateID} was not found on ioBroker`);

        // create _URL_SUBSCRIPTION for the stateID
        if (!_URL_SUBSCRIPTION.hasOwnProperty(stateID)) {
            _URL_SUBSCRIPTION[stateID] = [];

            // add the subscription if not yet done
            const resultPromise = adapter.subscribeForeignStatesAsync(stateID);
            const timeoutPromise = new Promise((resolve) => {
                setTimeout(resolve, timeout, { errorTM: '' });
            });
            const result1: any = await Promise.race([resultPromise, timeoutPromise]);
            if (result1.hasOwnProperty('error')) {
                throw new InternalServerErrorException(`Error while subscribe to ${stateID}`);
            }
            if (result1.hasOwnProperty('errorTM')) {
                throw new GatewayTimeoutException(`TimeoutError after ${timeout}ms`);
            }
        }

        if (forceOverwritte) {
            _URL_SUBSCRIPTION[stateID] = [];
        }

        for (const url of urls) {
            if (!_URL_SUBSCRIPTION[stateID].includes(url)) {
                _URL_SUBSCRIPTION[stateID].push(url);
            }
        }
        return { result: _URL_SUBSCRIPTION };
    };

    /**
     * get list with stateID's and the URL's
     * @returns Result with {result:_URL_SUBSCRIPTION {}}
     */
    public getURLNotificationSubscriptionList = (): Result => {
        AdapterStr.adapter?.log.silly('getURLNotificationSubscriptionList');
        return { result: _URL_SUBSCRIPTION };
    };

    /**
     * delete all the URLNotificationSubscriptions
     * @returns Result Promise with {result: _URL_SUBSCRIPTION {}}
     */
    public deleteAllURLNotificationSubscriptions = async (): Promise<Result> => {
        AdapterStr.adapter?.log.silly('deleteAllURLNotificationSubscriptions');

        const adapter = AdapterStr.adapter;
        if (!adapter) throw new InternalServerErrorException('ioBroker adapter not set ??');

        for (const id of Object.keys(_URL_SUBSCRIPTION)) {
            await adapter.unsubscribeForeignStatesAsync(id);
        }
        for (const id of Object.keys(_URL_SUBSCRIPTION)) {
            delete _URL_SUBSCRIPTION[id];
        }

        return { result: _URL_SUBSCRIPTION };
    };

    public deleteURLNotificationSubscriptions = async (props: DeleteURLNotification_DTO[]): Promise<Result> => {
        AdapterStr.adapter?.log.silly('deleteURLNotificationSubscriptions');

        const adapter = AdapterStr.adapter;
        if (!adapter) throw new InternalServerErrorException('ioBroker adapter not set ??');

        for (const mapping of props) {
            if (_URL_SUBSCRIPTION.hasOwnProperty(mapping.stateID)) {
                _URL_SUBSCRIPTION[mapping.stateID] = _URL_SUBSCRIPTION[mapping.stateID].filter(
                    (e) => !mapping.urls.includes(e),
                );
                if (_URL_SUBSCRIPTION[mapping.stateID].length == 0) {
                    await adapter.unsubscribeForeignStatesAsync(mapping.stateID);
                    delete _URL_SUBSCRIPTION[mapping.stateID];
                }
            }
        }

        return { result: _URL_SUBSCRIPTION };
    };
}
