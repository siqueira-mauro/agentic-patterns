import { generateText, stepCountIs } from 'ai';

import { model } from '../../helpers/selected-model.ts';
import { precoFrutas } from './price.tool.ts';

const PROMPT = 'Quais frutas estão disponíveis no Mercadinho e quais são seus preços?';

async function withoutTool() {
  const { text, usage } = await generateText({
    model,
    prompt: PROMPT
  });

  console.info(usage);
  console.debug(text);
}

async function withTools() {
  const { text, usage, steps } = await generateText({
    model,
    prompt: PROMPT,
    tools: { precoFrutas },  // uma lista (apesar do {})
    // Circuit Breaker
    // stopWhen: stepCountIs(6),
    // instructions:
    //   'Eres un asistente del catálogo de cursos de detalles. ' +
    //   ' No inventes precios, duraciones ni nombres de cursos. ' +
    //   ' Consúltalos siempre con las herramientas disponibles. ',
  });

  console.debug(steps);
  console.info(usage);
  console.info(text);
}

export { withoutTool, withTools };
