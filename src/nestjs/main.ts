import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

type T_AdapterStr = {
    adapter: ioBroker.Adapter | undefined;
};
export const AdapterStr: T_AdapterStr = {
    adapter: undefined,
};

export let DEFAULT_TIMEOUT = 20000;

async function bootstrap(adapter: ioBroker.Adapter): Promise<any> {
    AdapterStr.adapter = adapter;
    const app = await NestFactory.create(AppModule);
    await app.listen(8089);
    DEFAULT_TIMEOUT = (AdapterStr.adapter?.config as any)['GENEREL_default_timout'] || 5000;
}

export default bootstrap;
