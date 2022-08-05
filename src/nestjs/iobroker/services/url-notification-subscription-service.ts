import { HttpService } from '@nestjs/axios';
import { BadRequestException, GatewayTimeoutException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
    timeout!: number;
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
    public addURLNotificationSubscription = async ({
        stateID,
        urls,
        timeout = DEFAULT_TIMEOUT,
    }: AddURLNotification_DTO): Promise<Result> => {
        AdapterStr.adapter?.log.silly('URLNotificationSubscriptionService');

        const adapter = AdapterStr.adapter;
        if (!adapter) throw new InternalServerErrorException('ioBroker adapter not set ??');

        // check if stateID is availavle
        const a = await adapter.getForeignStateAsync(stateID);
        if (!a) throw new BadRequestException(`the stateID: ${stateID} was not found on ioBroker`);

        for (const url of urls) {
            if (!_URL_SUBSCRIPTION.hasOwnProperty(stateID)) {
                _URL_SUBSCRIPTION[stateID] = [];
                const resultPromise = adapter.subscribeForeignStatesAsync(stateID);
                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(resolve, timeout, { errorTM: '' });
                });
                const result1: any = await Promise.race([resultPromise, timeoutPromise]);
                if (result1.hasOwnProperty('error')) {
                    throw new InternalServerErrorException(`Error while subscribe to ${stateID}`);
                }
                if (result1.hasOwnProperty('errorTM')) {
                    throw new GatewayTimeoutException(`TimeoutError on miio test after ${timeout}ms`);
                }
            }
            if (_URL_SUBSCRIPTION.hasOwnProperty(stateID) && !_URL_SUBSCRIPTION[stateID].includes(url)) {
                _URL_SUBSCRIPTION[stateID].push(url);
            }
        }
        return { result: 'all ok' };
    };
}
