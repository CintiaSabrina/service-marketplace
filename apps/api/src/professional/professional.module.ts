import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';

import { ProfessionalRegistration } from './entities/professional-registration';
import { ProfessionalServices} from './entities/professional-services';
import { Login } from '../auth/entities/login';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfessionalRegistration,
      ProfessionalServices,
      Login,
    ]),
  ],
  controllers: [ProfessionalController],
  providers: [ProfessionalService],
})
export class ProfessionalModule {}
