import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalModule } from './professional/professional.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProfessionalModule,
    CustomerModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class AppModule {}