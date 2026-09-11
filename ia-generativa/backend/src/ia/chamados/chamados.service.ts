import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from '../../ia/providers/modelo.provider';
import {
  CHAMADO_CATEGORIAS,
  isCategoriaPermitida,
  normalizarCategoria,
} from './chamado-categoria';

@Injectable()
export class ChamadosService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modelo: ModeloProvider,
  ) {}

  async classificar(texto: string) {
    const textoNormalizado = texto.trim();

    const resultado = await this.modelo.gerar({
      mensagem:
        `Você é um classificador de chamados de uma instituição de ensino.

` +
        `Classifique o chamado em EXATAMENTE UMA destas categorias:

` +
        `ACESSO: problemas com senha, login, autenticação, bloqueio ou acesso a sistemas e portais.
` +
        `FINANCEIRO: problemas relacionados a cobrança, pagamento, boleto, mensalidade ou reembolso.
` +
        `MATRICULA: problemas relacionados a matrícula, cancelamento de disciplina, disciplina, turma ou período letivo.
` +
        `DOCUMENTOS: solicitações relacionadas a declaração, histórico escolar, certificado ou comprovante.
` +
        `OUTROS: qualquer assunto que não se encaixe nas categorias anteriores.

` +
        `Categorias permitidas: ${CHAMADO_CATEGORIAS.join(', ')}.

` +
        `Responda SOMENTE com o nome da categoria, sem explicações, pontuação ou texto adicional.

` +
        `Chamado:
${textoNormalizado}`,
    });

    const categoria = normalizarCategoria(resultado.resposta);

    if (!isCategoriaPermitida(categoria)) {
      throw new BadGatewayException('O modelo retornou uma categoria inválida');
    }

    return {
      texto: textoNormalizado,
      categoria,
      modelo: resultado.modelo,
    };
  }
}