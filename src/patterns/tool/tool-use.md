# Tool Use

Tool, Tool Use ou ainda Tool Usage

## O que é uma tool?

Um LLM só sabe o que aprendeu no treinamento: ele não conhece os preços de hoje, não acessa seu banco de dados e não executa ações no mundo. Uma **tool** (ferramenta) resolve isso: é uma função do seu código que o modelo pode **pedir** para executar.

Importante:
- **O modelo não executa a função**. Ele apenas devolve "quero chamar a tool `X` com estes argumentos". Quem executa é a sua aplicação (no nosso caso, a lib `ai`), que devolve o resultado ao modelo para ele montar a resposta final;
- **A resposta pode ou não passar de volta pelo modelo** (se não é necessário não deve passar).

Uma tool tem três partes:

| Parte | Para quê serve |
| --- | --- |
| `description` | Texto que o modelo lê para decidir **quando** usar a tool. |
| `inputSchema` | Schema (Zod) dos argumentos que o modelo deve enviar. |
| `execute` | A função real que roda no seu código e retorna o resultado. |

## O fluxo

```
prompt ──► LLM ──► "chame precoFrutas({})" ──► execute() ──► resultado ──► LLM* ──► texto final

* não necessáriamente precisa passar pelo LLM
```

Cada ida ao modelo é um **step**. Com tool, normalmente há pelo menos 2 steps: um em que o modelo pede a tool e outro em que ele responde usando o resultado.

## Como usar com a lib `ai` (Vercel AI SDK)

### 1. Definir a tool

`greeting.tool.ts`:

```ts
import { tool } from 'ai';
import { z } from 'zod';

const greetings = [
  "Opa, bão?!",
  "Aauuêe"
]

export const precoFrutas = tool({
  description: 'O usuário quer ser comprimentado em mineirês.',
  inputSchema: z.object({}), // esta tool não recebe argumentos
  execute: async () => greetings[randon()]
});
```

- A `description` é o que faz o modelo escolher a tool certa. Seja específico.
- `inputSchema` com `z.object({})` significa "sem parâmetros". Se a tool precisasse de argumentos, ex.: `z.object({ fruta: z.string() })`, o modelo preencheria esse campo e ele chegaria tipado no `execute`.
- `execute` pode chamar qualquer coisa: API, banco, arquivo.

### 2. Passar a tool para o modelo

`tool-use.ts`:

```ts
import { generateText } from 'ai';

const { text, steps } = await generateText({
  model,
  prompt: 'Quais frutas estão disponíveis no Mercadinho e quais são seus preços?',
  tools: { precoFrutas } // objeto: a chave é o nome que o modelo enxerga
});
```

O `tools` é um **objeto** (não array): a chave (`precoFrutas`) é o nome da tool para o modelo.

### 3. Comparar com e sem tool

O projeto tem duas funções para contrastar:

- `withoutTool()`: o modelo não tem acesso aos dados, então vai **inventar** frutas e preços (alucinação) ou dizer que não sabe.
- `withTools()`: o modelo chama `precoFrutas`, recebe a lista real e responde com os dados corretos.

Para ver o que aconteceu por dentro, inspecione `steps`: cada step mostra as tool calls pedidas e seus resultados. `usage` mostra o consumo de tokens (com tool é maior, pois há mais de uma ida ao modelo).

## Controles úteis

### Limitar o número de steps (circuit breaker)

Um modelo pode ficar chamando tools em loop. Limite com `stopWhen`:

```ts
import { generateText, stepCountIs } from 'ai';

await generateText({
  model,
  prompt,
  tools: { precoFrutas },
  stopWhen: stepCountIs(6) // para após 6 steps
});
```

### Instruções de sistema

Reforce que o modelo deve usar as tools em vez de inventar:

```ts
await generateText({
  model,
  prompt,
  tools: { precoFrutas },
  instructions:
    'Você é um assistente do Mercadinho. ' +
    'Não invente preços nem nomes de frutas. ' +
    'Consulte sempre as ferramentas disponíveis.'
});
```

## Boas práticas

- **Descrições claras**: o modelo só conhece a tool pela `description` e pelo schema.
- **Tools pequenas e com um único propósito** são escolhidas com mais acerto.
- **Valide a entrada** com Zod: o modelo pode errar argumentos.
- **Retorne dados enxutos**: tudo que o `execute` retorna volta para o contexto do modelo (custa tokens).
- **Cuidado com efeitos colaterais**: tools que escrevem, apagam ou pagam devem ter confirmação humana ou limites.
