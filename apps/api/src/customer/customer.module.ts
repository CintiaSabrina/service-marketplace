import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRegistration } from './entities/customer-registration';
import { Login } from '../auth/entities/login';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CustomerRegistration,
            Login,
        ]),
    ],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomerModule {}