import { Injectable } from '@nestjs/common';
import { AdapterStr } from '../main';
import { Command } from './command.interface';

@Injectable()
export class HelpService {
    private readonly rootCommands: Command[] = [
        { name: 'h', description: 'velo' },
        { name: 'iobroker/allInstanceNames', description: 'returns all Instance name like admin.0' },
        {
            name: 'iobroker/searchAllTypesWithNamePatternIncludes',
            description: 'return all object from input value type including string from value pattern',
        },
    ];

    getRootCommands(): Command[] {
        return this.rootCommands;
    }

    async getTest(): Promise<any> {
        const testResultPromise = AdapterStr.adapter?.getStateAsync('sg_webapi.0.testVariable');
        const timeout = 1000;
        const timoutPromise = new Promise((resolve) => {
            setTimeout(resolve, timeout, { error: `TimeoutError on h : error after ${timeout}ms` });
        });
        const result = await Promise.race([testResultPromise, timoutPromise]);
        return result;
    }
}
