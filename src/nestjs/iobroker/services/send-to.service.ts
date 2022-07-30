import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { AdapterStr, DEFAULT_TIMEOUT } from '../../main';
import { Result } from '../interfaces/result.interface';

export class SendTo_DTO {
    @IsNotEmpty()
    @IsString()
    instance!: string;

    @IsNotEmpty()
    @IsString()
    command!: string;

    @IsOptional()
    @IsObject()
    message: any;

    @IsOptional()
    @IsNumber()
    timeout!: number;
}

@Injectable()
export class SendToService {
    public async sendTo({ instance, command, message, timeout = DEFAULT_TIMEOUT }: SendTo_DTO): Promise<Result> {
        AdapterStr.adapter?.log.info('SendToService');
        const sendToResultPromise = AdapterStr.adapter?.sendToAsync(instance, command, message);
        const timoutPromise = new Promise((resolve) => {
            setTimeout(resolve, timeout, { error: `TimeoutError on ${instance} : ${command} after ${timeout}ms` });
        });
        const result = await Promise.race([sendToResultPromise, timoutPromise]);
        return { result };
    }
}
