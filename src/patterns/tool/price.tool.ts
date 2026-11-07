import { tool } from "ai";
import { z } from 'zod';

import { getPrecoFrutas } from "./mercadinho.api.ts";

export const precoFrutas = tool({
  description: 'Busca uma lista de frutas e seus preços na API do Mercadinho.',
  inputSchema: z.object({}),
  execute: async () => getPrecoFrutas()
});
