import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    constructor(private params: any) {}
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!this.params && !this.params.meta && !metadata.metatype) {
            throw new BadRequestException('unknown error');
        }
        const object = plainToInstance(this.params.meta, value);
        const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            console.log(errors);
            throw new BadRequestException(Object.values((errors as any)[0].constraints));
        }
        return value;
    }
}
