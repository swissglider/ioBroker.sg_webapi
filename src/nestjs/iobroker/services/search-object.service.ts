import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, validate } from 'class-validator';
import { AdapterStr, DEFAULT_TIMEOUT } from '../../main';
import { ObjectType } from '../interfaces/object.type';
import { Result } from '../interfaces/result.interface';

export class SearchAllTypesWithNamePatternIncludes_DTO {
    @IsNotEmpty()
    @IsString()
    type!: ObjectType | undefined;

    @IsOptional()
    @IsString()
    pattern!: string | undefined;

    @IsOptional()
    @IsString()
    path!: string | undefined;

    @IsOptional()
    @IsNumber()
    timeout!: number | undefined;
}

export class SearchAllTypesWithNamePatternIncludesBatch_DTO {
    @IsOptional()
    batch!: SearchAllTypesWithNamePatternIncludes_DTO[];

    @IsOptional()
    @IsNumber()
    timeout!: number | undefined;
}

const validateBatchDTO = async (batch: SearchAllTypesWithNamePatternIncludes_DTO[]): Promise<void> => {
    if (!batch && !Array.isArray(batch)) {
        throw new BadRequestException('Batch Parameter wrong configured');
    }
    for (const value of batch) {
        const object = plainToInstance(SearchAllTypesWithNamePatternIncludes_DTO, value);
        const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            console.log(errors);
            throw new BadRequestException(Object.values((errors as any)[0].constraints));
        }
    }
    return;
};

@Injectable()
export class SearchObjectService {
    async searchAllTypesWithNamePatternIncludes({
        type = undefined,
        pattern = undefined,
        path = '*',
        timeout = DEFAULT_TIMEOUT,
    }: SearchAllTypesWithNamePatternIncludes_DTO): Promise<Result> {
        AdapterStr.adapter?.log.info('SearchObjectService');
        const testResultPromise = AdapterStr.adapter?.getForeignObjectsAsync(path, type);
        const timoutPromise = new Promise((resolve) => {
            setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
        });
        const result = await Promise.race([testResultPromise, timoutPromise]);
        if (result && typeof result === 'object' && !pattern) {
            return { result };
        }
        if (result && typeof result === 'object') {
            const newResult: Record<string, any> = {};
            for (const [key, value] of Object.entries(result)) {
                if (value.common.name && typeof value.common.name === 'string' && value.common.name.includes(pattern)) {
                    newResult[key] = value;
                    continue;
                }
                if (value.common.name && typeof value.common.name === 'object') {
                    for (const val of Object.values(value.common.name)) {
                        if (pattern && val && typeof val === 'string' && val.includes(pattern)) {
                            newResult[key] = value;
                            continue;
                        }
                    }
                }
            }
            console.log(Object.keys(newResult));
            return { result: newResult };
        }
        return { error: result };
    }
    async searchAllTypesWithNamePatternIncludesBatch({
        batch = [],
        timeout = DEFAULT_TIMEOUT,
    }: SearchAllTypesWithNamePatternIncludesBatch_DTO): Promise<Result> {
        await validateBatchDTO(batch);

        const promises = [];
        for (const { type = undefined, path = '*' } of batch) {
            promises.push(AdapterStr.adapter?.getForeignObjectsAsync(path, type));
        }
        const allPromises = Promise.all(promises);
        const timoutPromise = new Promise((resolve) => {
            setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
        });
        const rawResult = await Promise.race([allPromises, timoutPromise]);

        if (!rawResult || typeof rawResult !== 'object') {
            return { error: 'Unknown Error' };
        }

        if (rawResult.hasOwnProperty('error')) {
            return { error: (rawResult as any).error };
        }

        if (Array.isArray(rawResult)) {
            const result: Record<string, ioBroker.Object> = {};
            for (const index in batch) {
                const { pattern = undefined } = batch[index];
                const obj: Record<string, ioBroker.Object> = rawResult[index];
                if (!pattern) {
                    for (const [key, value] of Object.entries(obj)) {
                        result[key] = value as ioBroker.Object;
                    }
                } else {
                    for (const [key, value] of Object.entries(obj)) {
                        if (
                            value.common.name &&
                            typeof value.common.name === 'string' &&
                            value.common.name.includes(pattern)
                        ) {
                            result[key] = value;
                            continue;
                        }
                        if (value.common.name && typeof value.common.name === 'object') {
                            for (const val of Object.values(value.common.name)) {
                                if (pattern && val && typeof val === 'string' && val.includes(pattern)) {
                                    result[key] = value;
                                    continue;
                                }
                            }
                        }
                    }
                }
            }
            console.log(Object.keys(result));
            return { result };
        }
        return { error: 'Unknown Error' };
    }
}
