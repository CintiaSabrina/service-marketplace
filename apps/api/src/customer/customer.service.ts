import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { CustomerRegistration } from './entities/customer-registration';
import { Login } from '../auth/entities/login';

@Injectable()
export class CustomerService{

    constructor(
        @InjectRepository(CustomerRegistration)
        private readonly customerRepository: Repository<CustomerRegistration>,
         @InjectRepository(Login)
        private readonly loginRepository: Repository<Login>,
    ){}

    async create(customerData: any, files: any){

        if(customerData.password !== customerData.confirm_password) {
            throw new Error ("As senhas não coincidem.")
        }

        delete customerData.confirm_password;

        const booleanFields = [
            'declaration_accepted',
            'accept_terms_and_privacy',
        ];

        booleanFields.forEach((field) => {
            const value = customerData[field];

            customerData[field] =
                value === true ||
                value === 'true' ||
                value === 'on' ||
                value === '1';
        });

        if(files && files.length > 0){
            const profileFile = files.find((file: any) => file.fieldname === 'profile_picture');

            if(profileFile){
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = path.extname(profileFile.originalname);
                const fileName = `profile-${uniqueSuffix}${ext}`;

                const uploadDir = path.join(process.cwd(), 'uploads');

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const filePath = path.join(uploadDir, fileName);

                fs.writeFileSync(filePath, profileFile.buffer);

                customerData.profile_picture = `/uploads/profiles/${fileName}`;
            }
        }

        const newCustomer = this.customerRepository.create(
            customerData as CustomerRegistration
        )

        const savedCustomer = await this.customerRepository.save(newCustomer);

        const hashedPassword = await bcypt.hash(customerData.password, 10);

        const newLogin = this.loginRepository.create({
                email: customerData.email,
                password: hashedPassword,
                user_type: 'customer',
                is_active: true,
                customer: savedCustomer,
        });

        await this.loginRepository.save(newLogin);

        return {
            customer: savedCustomer
        }
    }
} 

