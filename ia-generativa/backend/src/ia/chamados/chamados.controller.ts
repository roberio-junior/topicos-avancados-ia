import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';

import { ChamadosService } from './chamados.service';
import { ClassificarChamadoDto } from './dto/classificar-chamado.dto';
import { AnalisarInformacoesAusentesDto } from './dto/analisar-informacoes-ausentes.dto';

@Controller('chamados')
export class ChamadosController {
  constructor(
    private readonly chamadosService: ChamadosService,
  ) {}

  @Post('classificar')
  @HttpCode(200)
  classificar(@Body() dto: ClassificarChamadoDto) {
    return this.chamadosService.classificar(dto.texto);
  }

  @Post('informacoes-ausentes')
  @HttpCode(200)
  identificarInformacoesAusentes(
    @Body() dto: AnalisarInformacoesAusentesDto,
  ) {
    return this.chamadosService.identificarInformacoesAusentes(
      dto.texto,
    );
  }
}