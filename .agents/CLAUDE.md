# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Repositorio de estudio sobre patrones de diseño agéntico (README y comentarios del código están en español). Stack: TypeScript + Node.js (ESM, `"type": "module"`) con el [AI SDK](https://www.npmjs.com/package/ai) (`generateText`, etc.) y Zod. No hay tests ni linter configurados.

## Comandos

- `pnpm install` — instalar dependencias
- `pnpm dev` — ejecuta `src/main.ts` directo con `node --env-file=.env` (type stripping nativo, sin transpilar)
- `pnpm watch` — igual, con `node --watch`
- `pnpm typecheck` — `tsc --noEmit` (solo verificación de tipos; no hay build ni `dist/`)

Requiere un `.env` (copiar de `.env.template`) con la API key del proveedor activo en `src/helpers/selected-model.ts` (por defecto `GROQ_API_KEY`).

## Arquitectura

- `src/main.ts` es el punto de entrada y se edita para elegir qué patrón/función ejecutar (el README lo indica así). Importa `helpers/string-colors.ts` por su efecto secundario.
- `src/patterns/` (vacío por ahora) es donde van los patrones agénticos nuevos.
- `src/helpers/selected-model.ts` centraliza el modelo: exporta un único `model` que usa todo el código. Para cambiar de proveedor se comenta/descomenta la línea correspondiente (Groq, Anthropic, OpenAI, Gemini, Ollama). Groq (`openai/gpt-oss-20b`) debe seguir como valor por defecto (decisión explícita en el historial git).
- `src/helpers/create-tracer.ts` — `createTracer(label)` devuelve `onStepFinish` (se pasa a `generateText`) para imprimir pasos, tool calls/results y tokens, y `summary()`.
- `src/helpers/string-colors.ts` — extiende `String.prototype` con getters (`.green`, `.yellow`, `.blue`, `.red`, `.purple`) y los declara globalmente; hay que importarlo (directo o vía `helpers/index.ts`) antes de usar los colores.
- `src/actions/get-message-model.ts` — tres variantes de una llamada de verificación del modelo (simple, con traza, con manejo de errores por status HTTP/red).

## Convenciones

- Los imports relativos usan extensión `.ts` (Node ejecuta los archivos tal cual). Solo sintaxis borrable (`erasableSyntaxOnly`): sin `enum`/`namespace`; los tipos se importan con `import type` (`verbatimModuleSyntax`).
- `strict: true`, `noEmit`. Requiere Node >= 23.6.
- `.agents/skills/ai-sdk/SKILL.md` contiene una skill del AI SDK (ver `skills-lock.json`); consúltala al escribir código con el SDK.
