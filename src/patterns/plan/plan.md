# Plan

Planning, Planificación o ainda Plan-and-Execute

## ¿Qué es la planificación?

El modelo descompone la tarea en pasos **ANTES** de ejecutar.

Sin planificación, el modelo intenta resolver todo de una vez y pierde restricciones por el camino: manda un héroe que no contrarresta el poder del villano, se pasa de las horas disponibles, o captura a un villano después de que otro ya haya liberado a media prisión.

Con planificación, cada paso resuelve una sola cosa y arrastra el resultado al siguiente.

Importante:
- **Planear no es resolver**. En la fase de plan el modelo solo devuelve los pasos (objetivo y razón); no ejecuta nada todavía;
- **El plan es un dato estructurado**, no texto libre: así la aplicación puede validarlo, recorrerlo paso a paso o mostrarlo al usuario antes de ejecutar;
- **Cuesta más llamadas y más tokens**. Si no hay restricciones que perder, planificar no compra nada.

## El flujo

```
                       ┌─ 1. Planear ─► [paso 1, paso 2, ... paso N]
prompt ──► LLM ────────┤
                       ├─ 2. Ejecutar ─► paso 1 ─► paso 2 ─► ... (cada uno arrastra el resultado)
                       │
                       └─ 3. Sintetizar ─► respuesta final
```

| Fase | Qué hace |
| --- | --- |
| **Planear** | Una llamada que solo descompone la tarea en pasos ordenados, donde cada paso depende del anterior. |
| **Ejecutar** | Una llamada por paso; cada una recibe el resultado de las anteriores. |
| **Sintetizar** | Une los resultados en la respuesta final. |

## Cómo usar con la lib `ai` (Vercel AI SDK)

Ejemplo simplificado: organizar una cena para 6 personas.

### 1. Planear

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output: plan } = await generateText({
  model,
  prompt: 'Organiza una cena para 6 personas con un presupuesto de 120 €.',
  instructions: 'NO resuelvas la tarea todavía. Solo descomponla en pasos ordenados.',
  output: Output.object({
    schema: z.array(z.object({
      goal: z.string().describe('El objetivo del paso en una frase'),
      reason: z.string().describe('Por qué este paso va en esta posición'),
    })).min(2).max(5),
  }),
});
```

- Se usa `output: Output.object(...)` en `generateText` y se lee `output` (`generateObject` está siendo depreciado);
- `instructions` prohíbe resolver: esta llamada solo produce el plan;
- `reason` obliga al modelo a justificar el orden, no solo a listar;
- `.min(2).max(5)` acota el tamaño del plan.

### 2. Ejecutar el plan

```ts
const results: string[] = [];

for (const step of plan) {
  const { text } = await generateText({
    model,
    prompt:
      `Tarea original: ${TASK}\n` +
      `Resultados anteriores:\n${results.join('\n')}\n\n` +
      `Resuelve SOLO este paso: ${step.goal}`,
  });
  results.push(`${step.goal}: ${text}`);
}
```

Una llamada por paso. Cada una recibe la tarea original y los resultados acumulados: así las restricciones sobreviven hasta el final.

### 3. Sintetizar

```ts
const { text } = await generateText({
  model,
  prompt: `Tarea: ${TASK}\nResultados:\n${results.join('\n')}\n\nEntrega la respuesta final.`,
});
```

## Buenas prácticas

- **Planear y ejecutar en llamadas separadas**: mezclarlas hace que el modelo salte directo a la solución;
- **Plan estructurado** (schema Zod) en vez de texto libre: se puede validar y recorrer en código;
- **Pide la razón de cada paso**: obliga al modelo a razonar el orden, no solo a listar;
- **Acota el número de pasos**: planes largos acumulan errores y cuestan más;
- **Repite las restricciones en cada paso**: lo que no se arrastra se pierde;
- **Úsalo solo si hay restricciones que perder**: para tareas simples, una llamada basta y es más barata.

---

## Implementación en este proyecto

El ejemplo real es una persecución de superhéroes: **recapturar 7 villanos fugados con 5 héroes**. Los archivos:

- `universe.ts`: datos del escenario (villanos y héroes) y `SCENARIO_AS_TEXT`, el texto que se pega en el prompt;
- `plan.ts`: `withoutPlanning()` y `withPlanning()`, más `planningMain()` que las compara en una tabla.

El enunciado cruza cuatro restricciones:

| # | Restricción |
| --- | --- |
| 1 | Cada villano solo cae ante una especialidad concreta. |
| 2 | Cada héroe tiene un límite de horas. |
| 3 | Cada operación consume 2 horas del héroe asignado. |
| 4 | Mirror Master DEBE ir primero, o el resto se vuelve a escapar. |

Mirror Master es la trampa: el texto **no dice** que puede liberar a los demás; el modelo debe deducirlo de su poder ("puede sacar a otros de sus celdas"). Resolver todo "de un tirón" casi siempre rompe alguna restricción.

- **`withoutPlanning()`**: una sola llamada con el prompt completo. Es la línea base;
- **`withPlanning()`**: primero una llamada que devuelve el plan (`goal` + `reason`, de 2 a 5 pasos). Ejecutar y sintetizar siguen pendientes de implementar.

Qué verificar al comparar las respuestas:

- ¿Va Mirror Master primero?
- ¿Cada héroe contrarresta de verdad el poder asignado?
- ¿Los villanos son atrapados en orden de amenaza?
- ¿Alguien supera sus horas disponibles?

El escenario está calibrado para fallar si se quita cualquier héroe: el modelo debería decir que el operativo no es viable en vez de inventar horas.
