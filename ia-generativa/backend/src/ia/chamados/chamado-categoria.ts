export const CHAMADO_CATEGORIAS = [
  'ACESSO',
  'FINANCEIRO',
  'MATRICULA',
  'DOCUMENTOS',
  'OUTROS',
] as const;

export type ChamadoCategoria = (typeof CHAMADO_CATEGORIAS)[number];

export function isCategoriaPermitida(valor: string): valor is ChamadoCategoria {
  return (CHAMADO_CATEGORIAS as readonly string[]).includes(valor);
}

export function normalizarCategoria(resposta: string): string {
  return resposta.trim().toUpperCase();
}
