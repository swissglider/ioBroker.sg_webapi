import { BadRequestException, Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { DEFAULT_TIMEOUT } from '../main';
import { ValidationPipe } from '../validation.pipe';
import { Result } from './interfaces/result.interface';
import { AllInstanceService, GetAllInstanceNames_DTO } from './services/all-instances.service';
import { MIIOService, MIIO_DTO } from './services/miio-service';
import {
    SearchAllTypesWithNamePatternIncludesBatch_DTO,
    SearchAllTypesWithNamePatternIncludes_DTO,
    SearchObjectService,
} from './services/search-object.service';
import { SendToService, SendTo_DTO } from './services/send-to.service';
import {
    AddURLNotification_DTO,
    URLNotificationSubscriptionService,
} from './services/url-notification-subscription-service';

@Controller('iobroker')
export class IobrokerController {
    constructor(
        private allInstanceServise: AllInstanceService,
        private searchObjectService: SearchObjectService,
        private sendToService: SendToService,
        private mIIOService: MIIOService,
        private urlNotificationSubscriptionService: URLNotificationSubscriptionService,
    ) {
        this.allInstanceServise = new AllInstanceService();
        this.searchObjectService = new SearchObjectService();
        this.mIIOService = new MIIOService();
        this.urlNotificationSubscriptionService = new URLNotificationSubscriptionService();
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
        @Query() { type, pattern, timeout = DEFAULT_TIMEOUT, path = '*' }: SearchAllTypesWithNamePatternIncludes_DTO,
    ): Promise<Result> {
        return this.searchObjectService.searchAllTypesWithNamePatternIncludes({ type, pattern, timeout, path });
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

    @Post('miioGetSimpleMappingPost')
    public async miioGetSimpleMappingPost(
        @Body() { login, password, country, timeout = DEFAULT_TIMEOUT }: MIIO_DTO,
    ): Promise<Result> {
        return this.mIIOService.getSimpleMapping({ login, password, country, timeout });
    }

    @Get('miioGetSimpleMappingGet')
    public async miioGetSimpleMappingGet(): Promise<any> {
        return this.mIIOService.getSimpleMappingAll();
    }

    /**
     * add a state to subscribe.
     * if this state will change, the given urls will be called with the new state object
     * @param {stateID, urls, timeout}:AddURLNotification_DTO
     * @returns
     */
    @Post('addURLNotificationSubscription')
    public async addURLNotificationSubscription(
        @Body() { stateID, urls, timeout }: AddURLNotification_DTO,
    ): Promise<Result> {
        // check if parameters are ok
        if (!stateID) throw new BadRequestException('stateID musst be set');
        if (!(Array.isArray(urls) && urls.length > 0 && urls.every((url) => typeof url == 'string')))
            throw new BadRequestException('urls must be an Array of Strings');
        // check if valid URL'
        for (const url of urls) {
            let returnFalse = false;
            try {
                returnFalse = !Boolean(new URL(url));
            } catch (error) {
                returnFalse = true;
            }
            if (returnFalse) throw new BadRequestException(`the URL ${url} are not valid`);
        }

        return this.urlNotificationSubscriptionService.addURLNotificationSubscription({ stateID, urls, timeout });
    }
}
