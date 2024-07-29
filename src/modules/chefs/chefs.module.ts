import { Module } from '@nestjs/common';
import { ChefsService } from './chefs.service';
import { ChefsController } from './chefs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chef } from './entities/chef.entity';

@Module({
  controllers: [ChefsController],
  providers: [ChefsService],
  imports: [TypeOrmModule.forFeature([Chef])],
  exports: [ChefsService],
})
export class ChefsModule {}
