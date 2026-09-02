#### Tabela de preenchimento

Preencha uma linha para cada um dos dois modelos locais do Passo 1 e uma linha
para a API do Gemini utilizada no Passo 2.

| Modelo e versão | Ferramenta ou rota | Medição inicial | Medição completa | Diferença | Evidência técnica |
|---|---|---:|---:|---:|---|
| Qwen 2.5 0.5B | transformers | 18 | 2 | -16 | local |
| Mistral 7B | transformers | 24 | 2 | -22 | local |
| | | | | | API |

O significado de cada coluna é:

- **Modelo e versão:** identificador completo utilizado, e não apenas o nome da
  empresa ou da família; por exemplo, `Qwen/Qwen2.5-0.5B-Instruct`.
- **Ferramenta ou rota:** classe/biblioteca do tokenizador local ou endpoint
  oficial utilizado para obter a contagem.
- **Medição inicial:** no Passo 1, corresponde a `T_texto`, sem template e sem
  tokens especiais; no Passo 2, corresponde a `T_base`, retornado pela API para
  a mensagem simples.
- **Medição completa:** no Passo 1, corresponde a `T_mensagem`, depois da
  aplicação do chat template; no Passo 2, corresponde a `T_completa`, depois de
  acrescentar a instrução de sistema.
- **Diferença:** no Passo 1, `overhead = T_mensagem - T_texto`; no Passo 2,
  `delta_API = T_completa - T_base`. Os dois valores não medem exatamente a
  mesma coisa e não devem ser comparados como equivalentes.
- **Evidência técnica:** para execução local, registre a classe e a revisão do
  tokenizer; para API, registre a data, a rota e o nome exato do modelo. Nunca
  registre a chave de API.