import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { IobrokerController } from './iobroker.controller';
import { AllInstanceService } from './services/all-instances.service';
import { SearchObjectService } from './services/search-object.service';
import { SendToService } from './services/send-to.service';

@Module({
    imports: [HttpModule],
    controllers: [IobrokerController],
    providers: [AllInstanceService, SearchObjectService, SendToService],
})
export class IobrokerModule {}
