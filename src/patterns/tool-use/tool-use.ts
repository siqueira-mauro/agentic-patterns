import { generateText, stepCountIs } from 'ai';

import { model } from '../../helpers/selected-model.ts';
import { fidelidade, precoFrutas } from './tools.ts';

const PROMPT = 'Quanto me custaria comprar todas as frutas do Mercadinho e quanto ficaria com meu desconto de fidelidade.';

async function withoutTool() {
  const { text, usage } = await generateText({
    model,
    prompt: PROMPT
  });

  console.info(usage);
  console.debug(text);
}

async function withTools() {
  const { text, usage } = await generateText({
    model,
    prompt: PROMPT,
    tools: { fidelidade, precoFrutas },
    // Circuit Breaker
    // stopWhen: stepCountIs(6),
    // instructions:
    //   'Eres un asistente del catálogo de cursos de detalles. ' +
    //   ' No inventes precios, duraciones ni nombres de cursos. ' +
    //   ' Consúltalos siempre con las herramientas disponibles. ',
  });

  console.info(usage);
  console.debug(text);
}

export { withoutTool, withTools };
