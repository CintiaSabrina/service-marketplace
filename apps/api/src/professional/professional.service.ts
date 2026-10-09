import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';
import { ProfessionalRegistration } from './entities/professional-registration';
import { ProfessionalServices } from './entities/professional-services';
import { Login } from '../auth/entities/login';

type ParsedService = {
  category: string;
  service_name: string;
  value_service: number;
};

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(ProfessionalRegistration)
    private readonly professionalRepository: Repository<ProfessionalRegistration>,

    @InjectRepository(ProfessionalServices)
    private readonly serviceRepository: Repository<ProfessionalServices>,

    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  private parsePrice(price: unknown): number {
    if (typeof price === 'number') return price;

    if (typeof price !== 'string') return 0;

    const onlyNumber = price
      .replace(/[^\d,]*/g, '')
      .replace(',', '.');

    const value = Number(onlyNumber);

    return Number.isNaN(value) ? 0 : value;
  }

  private parseServices(rawServices: unknown): ParsedService[] {
    let list: unknown = rawServices;

    if (typeof rawServices === 'string') {
      try {
        list = JSON.parse(rawServices);
      } catch {
        return [];
      }
    }

    if (!Array.isArray(list)) return [];

    return list
      .filter((item) => item && typeof item === 'object')
      .map((item: any) => ({
        category: String(item.category ?? '').trim(),
        service_name: String(item.name ?? '').trim(),
        value_service: this.parsePrice(item.price),
      }))
      .filter((item) => item.category && item.service_name);
  }

  async create(professionalData: any, files?: any[]) {
    if (professionalData.password !== professionalData.confirm_password) {
      throw new Error('As senhas não coincidem.');
    }

    const booleanFields = [
      'declaration_accepted',
      'accept_independent_contractor',
      'accept_terms_and_privacy',
    ];

    booleanFields.forEach((field) => {
      const value = professionalData[field];

      professionalData[field] =
        value === true ||
        value === 'true' ||
        value === 'on' ||
        value === '1';
    });

if (files && files.length > 0) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    const profileFile = files.find((file: any) => file.fieldname === 'profile_picture');
    if (profileFile) {
        const ext = path.extname(profileFile.originalname);
        const fileName = `profile-${uniqueSuffix}${ext}`;
        const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, profileFile.buffer);

        professionalData.profile_picture = `/uploads/profiles/${fileName}`;
    }

    // 2. Trata os Antecedentes Criminais (Privado / Separado)
    const criminalFile = files.find((file: any) => file.fieldname === 'criminal_record');
    if (criminalFile) {
        const ext = path.extname(criminalFile.originalname);
        const fileName = `criminal-${uniqueSuffix}${ext}`;
        
        const uploadDir = path.join(process.cwd(), 'uploads', 'documents');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, criminalFile.buffer);

        professionalData.criminal_record = `/uploads/documents/${fileName}`;
    }
}

    const servicesData = this.parseServices(professionalData.services);

    delete professionalData.services;
    delete professionalData.confirm_password;

    if (servicesData.length === 0) {
      throw new Error('Adicione pelo menos um serviço.');
    }

    const newProfessional =
      this.professionalRepository.create(
        professionalData as ProfessionalRegistration,
      );

    const savedProfessional =
      await this.professionalRepository.save(newProfessional);

    const hashedPassword = await bcypt.hash(professionalData.password, 10);

    const newLogin = this.loginRepository.create({
      email: professionalData.email,
      password: hashedPassword,
      user_type: 'professional',
      is_active: true,
      professional: savedProfessional as ProfessionalRegistration,
    });

    await this.loginRepository.save(newLogin);

    const serviceRows = servicesData.map((service) =>
      this.serviceRepository.create({
        professional: savedProfessional as ProfessionalRegistration,
        professional_id: savedProfessional.id,
        category: service.category,
        service: service.service_name,
        value_service: service.value_service,
      }),
    );

    await this.serviceRepository.save(serviceRows);

    return {
      professional: savedProfessional,
      services: servicesData,
    };
  }

  async get() {
    return await this.professionalRepository.find();
  }

  async getById(id: number) {
    const professional = await this.professionalRepository.findOne({
      where: { id },
      relations: {
        services: true,
      },
    });

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    return professional;
  }
}