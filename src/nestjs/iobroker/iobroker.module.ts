import { Module } from '@nestjs/common';
import { AllInstanceService } from './all-instances.service';
import { IobrokerController } from './iobroker.controller';

@Module({
    controllers: [IobrokerController],
    providers: [AllInstanceService],
})
export class IobrokerModule {}
