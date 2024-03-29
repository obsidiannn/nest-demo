import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileEncodeUtil } from "./encode/fileEncode";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,FileEncodeUtil],
})
export class AppModule {}
