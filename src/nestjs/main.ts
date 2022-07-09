import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

type T_AdapterStr = {
    adapter: ioBroker.Adapter | undefined;
};
export const AdapterStr: T_AdapterStr = {
    adapter: undefined,
};

async function bootstrap(adapter: ioBroker.Adapter) {
    AdapterStr.adapter = adapter;
    const app = await NestFactory.create(AppModule);
    await app.listen(8089);
}

export default bootstrap;
