import { Injectable } from '@nestjs/common';
import { AdapterStr } from '../main';
import { Result } from './result.interface';

const getAllInstances = async (): Promise<any> => {
    const testResultPromise = AdapterStr.adapter?.getForeignObjectsAsync('*', 'instance');
    const timeout = 1000;
    const timoutPromise = new Promise((resolve) => {
        setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
    });
    const result = await Promise.race([testResultPromise, timoutPromise]);
    return result;
};

@Injectable()
export class AllInstanceService {
    async getAllInstanceNames(): Promise<Result> {
        const result = await getAllInstances();
        if (result && typeof result === 'object' && result.hasOwnProperty('system.adapter.admin.0')) {
            return { result: Object.keys(result).map((e) => e.substring(15)) };
        }
        return { error: result };
    }
}
