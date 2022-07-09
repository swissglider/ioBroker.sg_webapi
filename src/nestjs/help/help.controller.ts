import { Controller, Get } from '@nestjs/common';
import { Command } from './command.interface';
import { HelpService } from './help.service';

@Controller('help')
export class HelpController {
    constructor(private helpService: HelpService) {
        this.helpService = new HelpService();
    }

    @Get()
    async getRootCommands(): Promise<Command[]> {
        console.log('==== Start getRootCommands ====');
        console.log(this.helpService);
        return this.helpService.getRootCommands();
    }

    @Get('test')
    async getTest(): Promise<any> {
        console.log('==== Start getTest ====');
        return this.helpService.getTest();
    }
}
