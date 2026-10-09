import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: any,
    @UploadedFiles() files: any[],
  ) {
    try {
      console.log('Dados recebidos:', body);
      console.log('Arquivos recebidos:', files);

      return await this.customerService.create(body, files);
    } catch (error) {
      if (error instanceof Error && error.message === 'As senhas não coincidem.') {
        throw new BadRequestException(error.message);
      }

      console.error('Erro ao criar cadastro de cliente:', error);

      throw new InternalServerErrorException(
        'Erro ao criar cadastro de cliente.',
      );
    }
  }
}
