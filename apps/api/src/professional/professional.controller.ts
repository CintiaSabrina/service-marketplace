import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  BadRequestException,
  InternalServerErrorException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ProfessionalService } from './professional.service';

@Controller('professional')
export class ProfessionalController {
  constructor(
    private readonly professionalService: ProfessionalService,
  ) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() body: any,
    @UploadedFiles() files: any[],
  ) {
    try {
      console.log('Dados recebidos:', body);
      console.log('Arquivos recebidos:', files);

      return await this.professionalService.create(body, files);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === 'As senhas não coincidem.' ||
          error.message === 'Adicione pelo menos um serviço.'
        ) {
          throw new BadRequestException(error.message);
        }
      }

      console.error('Erro ao criar cadastro profissional:', error);

      throw new InternalServerErrorException(
        'Erro ao criar cadastro profissional.',
      );
    }
  }

  @Get()
  async findAll() {
    return this.professionalService.get();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      return await this.professionalService.getById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(
        `Erro ao buscar profissional ${id}:`,
        error,
      );

      throw new InternalServerErrorException(
        'Erro ao buscar profissional.',
      );
    }
  }
}