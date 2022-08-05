import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AdapterStr, DEFAULT_TIMEOUT } from '../../main';
import { Result } from '../interfaces/result.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AuthMiIO, ApiMiIO } = require('miio-token-extractor');

export class MIIO_DTO {
    @IsNotEmpty()
    @IsString()
    login!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;

    @IsNotEmpty()
    @IsString()
    country!: string;

    @IsOptional()
    @IsNumber()
    timeout!: number;
}

export type Config_T = {
    login: string;
    password: string;
    country?: string;
};

export type SingleMapping_T = {
    did: string;
    name: string;
    model: string;
    isOnline: string;
    localip: string;
    parent_id: string;
    token: string;
    adapterName: string;
    channelType: string;
    room: string;
    place: string;
    ioBrokerChannelPath: string;
};

type Result_T = { result?: SingleMapping_T[]; error?: string | Error };

type CachedResult_T = Record<string, { updateTime: number; result: Result_T }>; // auto || __login__password__countr__

const CACHE_RESULT: CachedResult_T = {};

const _getDeviceList = async ({ login, password, country = '' }: Config_T): Promise<any> => {
    try {
        const authMiIO = new AuthMiIO();
        const apiMiIO = new ApiMiIO();
        const { userId, token, ssecurity } = await authMiIO.login(login, password);
        const devices = await apiMiIO.getDeviceList(userId, ssecurity, token, country);

        const channelResultPromise = await AdapterStr.adapter?.getForeignObjectsAsync('mihome.*', 'channel');
        if (channelResultPromise) {
            const filtered = Object.fromEntries(
                Object.entries(channelResultPromise).filter(([key]) => key.match(/^mihome\.[0-9]\.devices/i)),
            );
            const returnA = await Promise.all(
                devices.map(async (e: any): Promise<any> => {
                    const did = e.did.split('.').pop();
                    const ioBrokerChannel = Object.values(filtered).find((ee: any) => ee.native.sid === did);
                    let availableStyleButtons: { name: string; id: string; role: string }[] = [];
                    if (ioBrokerChannel) {
                        const buttonPromise = await AdapterStr.adapter?.getForeignObjectsAsync(
                            ioBrokerChannel._id + '.*',
                            'state',
                        );
                        if (buttonPromise) {
                            availableStyleButtons = Object.values(buttonPromise).map((bp) => ({
                                name: bp.common.name.toString(),
                                id: bp._id,
                                role: bp.common.role,
                            }));
                        }
                    }
                    return {
                        ...e,
                        ioBrokerChannelPath: ioBrokerChannel ? ioBrokerChannel._id : '',
                        availableStyleButtons,
                    };
                }),
            );
            return returnA;
        }

        // console.log(devices);

        return [];
    } catch (error) {
        throw error;
    }
};

const generateFullSimpleDeviceList = async (
    configS: Config_T | undefined = undefined,
    timeout = DEFAULT_TIMEOUT,
): Promise<Result_T> => {
    const promises: any[] = [];
    const config = AdapterStr.adapter?.config;
    const configA: Config_T[] = [];
    if (!config) throw new InternalServerErrorException('wrong configuration ??');
    if (!configS) {
        if (config['MIIO_activatedConfig1']) {
            configA.push({
                login: config['MIIO_login1'],
                password: config['MIIO_password1'],
                country: config['MIIO_country1'],
            });
        }
        if (config['MIIO_activatedConfig2']) {
            configA.push({
                login: config['MIIO_login2'],
                password: config['MIIO_password2'],
                country: config['MIIO_country2'],
            });
        }
    } else {
        configA.push(configS);
    }
    configA.forEach((e) => {
        promises.push(_getDeviceList(e));
    });
    const timeoutPromise = new Promise((resolve) => {
        setTimeout(resolve, timeout, { error: `TimeoutError on miio test after ${timeout}ms` });
    });

    try {
        const result1: any = await Promise.race([Promise.all(promises), timeoutPromise]);
        if (result1.hasOwnProperty('error')) {
            return result1;
        }

        const result: SingleMapping_T[] = [];
        result1.forEach((element: any[]) => {
            result.push(
                ...element.map((e: any) => {
                    const subs = e.name.split(' ');
                    return {
                        did: e.did.split('.').pop(),
                        name: e.name,
                        model: e.model,
                        isOnline: e.isOnline,
                        localip: e.localip,
                        parent_id: e.parent_id,
                        token: e.token,
                        adapterName: 'MiHome',
                        channelType: subs[0] ? subs[0] : '',
                        room: subs[1] ? subs[1] : '',
                        place: subs[2] ? subs[2] : '',
                        ioBrokerChannelPath: e.ioBrokerChannelPath,
                        availableStyleButtons: e.availableStyleButtons,
                        orgMIIOCloudInfo: e,
                    };
                }),
            );
        });
        return { result };
    } catch (error: any) {
        return { error: error.toString() };
    }
};

export const getFullSimpleDeviceList = async (
    configS: Config_T | undefined = undefined,
    timeout = DEFAULT_TIMEOUT,
    forceRefresh = false,
): Promise<Result_T> => {
    const idString = configS ? `__${configS.login}__${configS.password}__${configS.country ?? ''}__` : 'auto';
    const refreshTime =
        AdapterStr.adapter?.config.hasOwnProperty('MIIO_autoRefreshTimeout') &&
        AdapterStr.adapter.config['MIIO_autoRefreshTimeout']
            ? AdapterStr.adapter.config['MIIO_autoRefreshTimeout']
            : 50000;
    forceRefresh = AdapterStr.adapter?.config['MIIO_autoRefresh'] ? forceRefresh : true;
    const maxAge = Date.now() - refreshTime;
    const cacheResult = CACHE_RESULT.hasOwnProperty(idString) ? CACHE_RESULT[idString] : undefined;
    if (cacheResult && cacheResult.updateTime >= maxAge && !forceRefresh) {
        return cacheResult.result;
    }
    const tmpResult = await generateFullSimpleDeviceList(configS, timeout);
    CACHE_RESULT[idString] = {
        updateTime: Date.now(),
        result: tmpResult,
    };

    return tmpResult;
};

@Injectable()
export class MIIOService {
    public getSimpleMapping = async ({
        login,
        password,
        country,
        timeout = DEFAULT_TIMEOUT,
    }: MIIO_DTO): Promise<Result> => {
        AdapterStr.adapter?.log.info('SendToService');
        return generateFullSimpleDeviceList({ login, password, country }, timeout);
    };

    public getSimpleMappingAll = async (): Promise<Result> => {
        return getFullSimpleDeviceList();
    };
}
