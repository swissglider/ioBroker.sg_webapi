import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AdapterStr } from '../../main';
import { Result } from '../interfaces/result.interface';

export class ControlAdapter_DTO {
    @IsNotEmpty()
    @IsString()
    command!: 'start' | 'stop' | 'restart';

    @IsNotEmpty()
    @IsString()
    adapterName!: string;

    @IsNotEmpty()
    @IsNumber()
    instance!: number;

    @IsOptional()
    @IsNumber()
    timeout?: number;
}

@Injectable()
export class ControlAdapterService {
    public controlAdapter = async ({
        command,
        adapterName,
        instance,
    }: // timeout = DEFAULT_TIMEOUT,
    ControlAdapter_DTO): Promise<Result> => {
        AdapterStr.adapter?.log.silly('controlAdapter');

        const adapter = AdapterStr.adapter;
        if (!adapter) throw new InternalServerErrorException('ioBroker adapter not set ??');

        const obName = `system.adapter.${adapterName}.${instance}`;

        const obj = await adapter.getForeignObjectAsync(obName);
        if (!obj) {
            throw new InternalServerErrorException(`Adapter '${obName}' not available`);
        }
        if (command === 'start') {
            obj.common.enabled = true;
            await adapter.setForeignObjectAsync(obName, obj);
        }
        if (command === 'stop') {
            obj.common.enabled = false;
            await adapter.setForeignObjectAsync(obName, obj);
        }
        if (command === 'restart') {
            obj.common.enabled = false;
            await adapter.setForeignObjectAsync(obName, obj);
            await new Promise((resolve) => setTimeout(resolve, 50));
            obj.common.enabled = true;
            await adapter.setForeignObjectAsync(obName, obj);
        }

        return { result: 'proceeded' };
    };
}
