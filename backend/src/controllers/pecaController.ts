import { Request, Response } from 'express';
import { prisma } from '../index';

export const listarPecas = async (req: Request, res: Response) => {
  const pecas = await prisma.peca.findMany();
  res.json(pecas);
};

export const criarPeca = async (req: Request, res: Response) => {
  const { nome, tipo, fornecedor, status } = req.body;
  
  const peca = await prisma.peca.create({
    data: { nome, tipo, fornecedor, status }
  });
  
  res.status(201).json(peca);
};

export const atualizarStatusPeca = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const peca = await prisma.peca.update({
    where: { id },
    data: { status }
  });
  
  res.json(peca);
};

export const deletarPeca = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.peca.delete({
    where: { id }
  });
  
  res.status(204).send();
};