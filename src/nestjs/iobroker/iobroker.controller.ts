import { Controller, Get } from '@nestjs/common';
import { AllInstanceService } from './all-instances.service';
import { Result } from './result.interface';

@Controller('iobroker')
export class IobrokerController {
    constructor(private allInstanceServise: AllInstanceService) {
        this.allInstanceServise = new AllInstanceService();
    }

    @Get('allInstanceNames')
    async getAllInstanceNames(): Promise<Result> {
        console.log('==== Start getAllInstanceNames 1 ====');
        return this.allInstanceServise.getAllInstanceNames();
    }
}
