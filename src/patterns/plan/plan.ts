import { generateText, Output } from 'ai';
import { z } from 'zod';

import { model } from '../../helpers/selected-model.ts';

import { SCENARIO_AS_TEXT } from './universe.ts';

/**
 * El enunciado cruza cuatro restricciones:
 *   1. Cada villano solo cae ante una especialidad concreta.
 *   2. Cada héroe tiene un límite de horas.
 *   3. Cada operación consume 2 horas del héroe asignado.
 *   4. Mirror Master DEBE ir primero, o el resto se vuelve a escapar.
 *
 * Resolver esto "de un tirón" casi siempre rompe alguna.
 */
const PROMPT =
  'Se han fugado 7 villanos de la prisión de máxima seguridad. ' +
  'Diseña el operativo para recapturarlos a todos.\n\n' +
  'REGLAS:\n' +
  '  - Cada operación consume 2 horas del héroe asignado.\n' +
  '  - Los héroes pueden operar en paralelo; las horas son presupuesto individual.\n' +
  '  - Un héroe solo puede neutralizar villanos de su especialidad.\n' +
  '  - Ningún héroe puede exceder sus horas disponibles.\n' +
  '  - Atiende a los villanos por prioridad, donde 1 es el más urgente.\n' +
  '  - Si algún villano puede liberar a los demás, debe caer antes que nadie.\n' +
  '  - Si el operativo no es viable con los recursos disponibles, dilo.\n\n' +
  SCENARIO_AS_TEXT;


export async function withoutPlanning() {
  const { text, usage, steps } = await generateText({
    model,
    prompt: PROMPT,
  });

  console.debug(steps);
  console.info(usage);
  console.info(text);
}

export async function withPlanning() {
  // 1 - Planear
  // existia um generateObject, mas está sendo depreciado
  // vamos ignorar o text, e usar o output no lugar
  const { text: _, output: planSteps } = await generateText({
    model,
    prompt: PROMPT,
    instructions:
      'Eres un estratega. NO resuelvas el operativo todavía. ' +
      'Responde en español. ' +
      'Solo descomponlo en pasos ordenados, donde cada paso dependa ' +
      'del resultado del anterior.',
    output: Output.object({
      schema: z.array(z.object({
        goal: z.string().describe('El objetivo de este paso en el plan en una frase'),
        reason: z.string().describe('La razón por la cual se toma este paso en esta posición del plan'),
      })).min(2).max(5)
    }),
  });
  // const planSteps = output as Array<{ goal: string; reason: string }>;
  console.log(planSteps);

  // 2 - Ejecutar el plan

  // 3 - Sintetizar resultados
  // const { text, usage, steps } = await generateText({
  //   model,
  //   prompt: PROMPT,
  // });

  // console.debug(steps);
  // console.info(usage);
  // console.info(text);
}
