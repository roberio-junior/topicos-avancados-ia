export interface InformacaoAusente {
  informacao: string;
  motivo: string;
  pergunta: string;
}

export interface ResultadoInformacoesAusentes {
  suficientes: boolean;
  informacoesAusentes: InformacaoAusente[];
  revisaoHumana: boolean;
}

function isStringValida(valor: unknown): valor is string {
  return (
    typeof valor === 'string' &&
    valor.trim().length > 0
  );
}

function perguntaSolicitaSegredo(
  pergunta: string,
): boolean {
  const texto = pergunta.toLowerCase();

  const termosProibidos = [
    'senha',
    'password',
    'token',
    'código de autenticação',
    'codigo de autenticacao',
    'cpf completo',
    'documento pessoal completo',
  ];

  return termosProibidos.some((termo) =>
    texto.includes(termo),
  );
}

export function validarResultadoInformacoesAusentes(
  valor: unknown,
): valor is ResultadoInformacoesAusentes {
  if (
    typeof valor !== 'object' ||
    valor === null
  ) {
    return false;
  }

  const resultado =
    valor as Partial<ResultadoInformacoesAusentes>;

  if (
    typeof resultado.suficientes !== 'boolean' ||
    typeof resultado.revisaoHumana !== 'boolean' ||
    !Array.isArray(resultado.informacoesAusentes)
  ) {
    return false;
  }

  if (resultado.informacoesAusentes.length > 5) {
    return false;
  }

  if (
    resultado.suficientes &&
    resultado.informacoesAusentes.length > 0
  ) {
    return false;
  }

  if (
    !resultado.suficientes &&
    resultado.informacoesAusentes.length === 0
  ) {
    return false;
  }

  for (const item of resultado.informacoesAusentes) {
    if (
      typeof item !== 'object' ||
      item === null
    ) {
      return false;
    }

    const informacao =
      item as Partial<InformacaoAusente>;

    if (
      !isStringValida(informacao.informacao) ||
      !isStringValida(informacao.motivo) ||
      !isStringValida(informacao.pergunta)
    ) {
      return false;
    }

    if (
      perguntaSolicitaSegredo(
        informacao.pergunta,
      )
    ) {
      return false;
    }
  }

  return true;
}