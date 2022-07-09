import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HelpModule } from './help/help.module';
import { IobrokerModule } from './iobroker/iobroker.module';

@Module({
    imports: [HelpModule, IobrokerModule],
    controllers: [AppController],
})
export class AppModule {}
