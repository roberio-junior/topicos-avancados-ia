import { BadGatewayException } from '@nestjs/common';

import type { ModeloProvider } from '../providers/modelo.provider';
import { ChamadosService } from './chamados.service';

describe('ChamadosService - informações ausentes', () => {
  function criarModelo(
    resposta: string,
  ): ModeloProvider {
    return {
      gerar: jest.fn().mockResolvedValue({
        resposta,
        modelo: 'teste',
      }),

      gerarStream: jest.fn(),

      conversar: jest.fn(),
    };
  }

  it('aceita chamado completo com lista vazia', async () => {
    const modelo = criarModelo(
      JSON.stringify({
        suficientes: true,
        informacoesAusentes: [],
        revisaoHumana: false,
      }),
    );

    const service =
      new ChamadosService(modelo);

    const resultado =
      await service.identificarInformacoesAusentes(
        'Não consigo acessar o SIGAA. Ao tentar fazer login aparece a mensagem "usuário inválido". O problema começou hoje.',
      );

    expect(resultado.suficientes).toBe(true);

    expect(
      resultado.informacoesAusentes,
    ).toHaveLength(0);
  });

  it('identifica ausência da mensagem de erro', async () => {
    const modelo = criarModelo(
      JSON.stringify({
        suficientes: false,
        informacoesAusentes: [
          {
            informacao: 'Mensagem de erro',
            motivo:
              'Ajuda a identificar a causa do problema.',
            pergunta:
              'Qual mensagem de erro aparece na tela?',
          },
        ],
        revisaoHumana: false,
      }),
    );

    const service =
      new ChamadosService(modelo);

    const resultado =
      await service.identificarInformacoesAusentes(
        'O sistema apresenta um erro quando tento fazer a matrícula.',
      );

    expect(resultado.suficientes).toBe(false);

    expect(
      resultado.informacoesAusentes,
    ).toHaveLength(1);
  });

  it('identifica sistema afetado como informação ausente', async () => {
    const modelo = criarModelo(
      JSON.stringify({
        suficientes: false,
        informacoesAusentes: [
          {
            informacao: 'Sistema afetado',
            motivo:
              'É necessário saber onde o problema ocorre.',
            pergunta:
              'Em qual sistema o problema está acontecendo?',
          },
        ],
        revisaoHumana: false,
      }),
    );

    const service =
      new ChamadosService(modelo);

    const resultado =
      await service.identificarInformacoesAusentes(
        'Não consigo realizar minha matrícula desde ontem.',
      );

    expect(
      resultado.informacoesAusentes[0]
        .informacao,
    ).toBe('Sistema afetado');
  });

  it('aceita no máximo cinco informações ausentes', async () => {
    const informacoesAusentes =
      Array.from(
        { length: 6 },
        (_, index) => ({
          informacao: `Informação ${index}`,
          motivo: 'Motivo',
          pergunta: `Pergunta ${index}?`,
        }),
      );

    const modelo = criarModelo(
      JSON.stringify({
        suficientes: false,
        informacoesAusentes,
        revisaoHumana: false,
      }),
    );

    const service =
      new ChamadosService(modelo);

    await expect(
      service.identificarInformacoesAusentes(
        'Não funciona e preciso de ajuda.',
      ),
    ).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('rejeita pergunta solicitando senha', async () => {
    const modelo = criarModelo(
      JSON.stringify({
        suficientes: false,
        informacoesAusentes: [
          {
            informacao: 'Credencial',
            motivo: 'Verificar acesso',
            pergunta:
              'Qual é a sua senha?',
          },
        ],
        revisaoHumana: false,
      }),
    );

    const service =
      new ChamadosService(modelo);

    await expect(
      service.identificarInformacoesAusentes(
        'Não consigo entrar no sistema.',
      ),
    ).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('rejeita JSON inválido retornado pelo modelo', async () => {
    const modelo =
      criarModelo('resposta inválida');

    const service =
      new ChamadosService(modelo);

    await expect(
      service.identificarInformacoesAusentes(
        'Não consigo acessar o sistema.',
      ),
    ).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});