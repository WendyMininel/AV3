import { Request, Response } from 'express';
import { prisma } from '../index';

export const listarAeronaves = async (req: Request, res: Response) => {
  const aeronaves = await prisma.aeronave.findMany({
    include: {
      etapas: true,
      testes: true
    }
  });
  res.json(aeronaves);
};

export const buscarAeronave = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const aeronave = await prisma.aeronave.findUnique({
    where: { codigo },
    include: {
      etapas: true,
      testes: true
    }
  });
  
  if (!aeronave) {
    return res.status(404).json({ error: 'Aeronave não encontrada' });
  }
  
  res.json(aeronave);
};

export const criarAeronave = async (req: Request, res: Response) => {
  const { codigo, modelo, tipo, capacidade, alcance } = req.body;
  
  const aeronave = await prisma.aeronave.create({
    data: {
      codigo,
      modelo,
      tipo,
      capacidade: capacidade || 0,
      alcance: alcance || 0
    }
  });
  
  res.status(201).json(aeronave);
};

export const atualizarAeronave = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  const { modelo, tipo, capacidade, alcance } = req.body;
  
  const aeronave = await prisma.aeronave.update({
    where: { codigo },
    data: { modelo, tipo, capacidade, alcance }
  });
  
  res.json(aeronave);
};

export const deletarAeronave = async (req: Request, res: Response) => {
  const { codigo } = req.params;
  
  await prisma.aeronave.delete({
    where: { codigo }
  });
  
  res.status(204).send();
};