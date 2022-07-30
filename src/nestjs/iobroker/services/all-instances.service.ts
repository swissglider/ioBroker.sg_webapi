import { Injectable } from '@nestjs/common';
import { IsNumber, IsOptional } from 'class-validator';
import { AdapterStr, DEFAULT_TIMEOUT } from '../../main';
import { Result } from '../interfaces/result.interface';

export class GetAllInstanceNames_DTO {
    @IsOptional()
    @IsNumber()
    timeout!: number | undefined;
}

const getAllInstances = async (timeout: number): Promise<any> => {
    const testResultPromise = AdapterStr.adapter?.getForeignObjectsAsync('*', 'instance');
    const timoutPromise = new Promise((resolve) => {
        setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
    });
    const result = await Promise.race([testResultPromise, timoutPromise]);
    return result;
};

@Injectable()
export class AllInstanceService {
    async getAllInstanceNames({ timeout = DEFAULT_TIMEOUT }: GetAllInstanceNames_DTO): Promise<Result> {
        AdapterStr.adapter?.log.info('AllInstanceService');
        const result = await getAllInstances(timeout);
        if (result && typeof result === 'object' && result.hasOwnProperty('system.adapter.admin.0')) {
            return { result: Object.keys(result).map((e) => e.substring(15)) };
        }
        return { error: result };
    }
}
