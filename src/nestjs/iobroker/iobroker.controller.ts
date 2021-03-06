import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { DEFAULT_TIMEOUT } from '../main';
import { ValidationPipe } from '../validation.pipe';
import { Result } from './interfaces/result.interface';
import { AllInstanceService, GetAllInstanceNames_DTO } from './services/all-instances.service';
import {
    SearchAllTypesWithNamePatternIncludesBatch_DTO,
    SearchAllTypesWithNamePatternIncludes_DTO,
    SearchObjectService,
} from './services/search-object.service';
import { SendToService, SendTo_DTO } from './services/send-to.service';

@Controller('iobroker')
export class IobrokerController {
    constructor(
        private allInstanceServise: AllInstanceService,
        private searchObjectService: SearchObjectService,
        private sendToService: SendToService,
    ) {
        this.allInstanceServise = new AllInstanceService();
        this.searchObjectService = new SearchObjectService();
    }

    @Get('allInstanceNames')
    @UsePipes(new ValidationPipe({ meta: GetAllInstanceNames_DTO }))
    async getAllInstanceNames(@Query() { timeout = DEFAULT_TIMEOUT }: GetAllInstanceNames_DTO): Promise<Result> {
        console.log('==== Start getAllInstanceNames 1 ====');
        return this.allInstanceServise.getAllInstanceNames({ timeout });
    }

    @Get('searchAllTypesWithNamePatternIncludes')
    @UsePipes(new ValidationPipe({ meta: SearchAllTypesWithNamePatternIncludes_DTO }))
    async searchAllTypesWithNamePatternIncludes(
        @Query() { type, pattern, timeout = DEFAULT_TIMEOUT }: SearchAllTypesWithNamePatternIncludes_DTO,
    ): Promise<Result> {
        return this.searchObjectService.searchAllTypesWithNamePatternIncludes({ type, pattern, timeout });
    }

    @Post('searchAllTypesWithNamePatternIncludesBatch')
    @UsePipes(new ValidationPipe({ meta: SearchAllTypesWithNamePatternIncludesBatch_DTO }))
    async searchAllTypesWithNamePatternIncludesBatch(
        @Body() { batch, timeout = DEFAULT_TIMEOUT }: SearchAllTypesWithNamePatternIncludesBatch_DTO,
    ): Promise<Result> {
        return this.searchObjectService.searchAllTypesWithNamePatternIncludesBatch({ batch, timeout });
    }

    @Post('sendTo')
    public async sendTo(
        @Body() { instance, command, message = {}, timeout = DEFAULT_TIMEOUT }: SendTo_DTO,
    ): Promise<Result> {
        return this.sendToService.sendTo({ instance, command, message, timeout });
    }
}
