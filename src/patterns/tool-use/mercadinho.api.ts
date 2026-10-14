export async function getFidelidade(userId: string): Promise<{ desconto: number }> {
  return { desconto: 0.1 };
}

export async function getPrecoFrutas(): Promise<{ nome: string; preco: number }[]> {
  return [
    { nome: 'Maçã', preco: 2.5 },
    { nome: 'Banana', preco: 1.8 },
    { nome: 'Laranja', preco: 3.0 },
    { nome: 'Uva', preco: 4.0 },
    { nome: 'Pera', preco: 3.5 }
  ];
}
