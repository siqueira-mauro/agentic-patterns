import { tool } from "ai";
import { z } from 'zod';

import { getFidelidade, getPrecoFrutas } from "./mercadinho.api.ts";

export const fidelidade = tool({
  description: 'Busca o desconto de fidelidade atual do usuário.',
  inputSchema: z.object({
    userId: z.string()
  }),
  execute: async ({ userId }) => getFidelidade(userId)
});

export const precoFrutas = tool({
  description: 'Busca os preços atuais das frutas no Mercadinho.',
  inputSchema: z.object({}),
  execute: async () => getPrecoFrutas()
});