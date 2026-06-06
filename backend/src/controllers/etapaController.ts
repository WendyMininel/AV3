import { Request, Response } from 'express';
import { prisma } from '../index';

export const listarEtapas = async (req: Request, res: Response) => {
  const { aeronaveCodigo } = req.query;
  
  const where: any = {};
  if (aeronaveCodigo) {
    where.aeronaveCodigo = aeronaveCodigo as string;
  }
  
  const etapas = await prisma.etapa.findMany({
    where,
    include: {
      funcionarios: {
        include: {
          funcionario: true
        }
      }
    }
  });
  
  res.json(etapas);
};

export const criarEtapa = async (req: Request, res: Response) => {
  const { nome, prazo, aeronaveCodigo } = req.body;
  
  const etapa = await prisma.etapa.create({
    data: {
      nome,
      prazo: new Date(prazo),
      status: 'PENDENTE',
      aeronaveCodigo
    }
  });
  
  res.status(201).json(etapa);
};

export const iniciarEtapa = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const etapa = await prisma.etapa.update({
    where: { id },
    data: { status: 'ANDAMENTO' }
  });
  
  res.json(etapa);
};

export const finalizarEtapa = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const etapa = await prisma.etapa.update({
    where: { id },
    data: { status: 'CONCLUIDA' }
  });
  
  res.json(etapa);
};

export const associarFuncionario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { funcionarioId } = req.body;
  
  await prisma.funcionarioEtapa.create({
    data: {
      etapaId: id,
      funcionarioId
    }
  });
  
  res.status(201).json({ message: 'Funcionário associado com sucesso' });
};