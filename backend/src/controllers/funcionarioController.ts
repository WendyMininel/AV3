import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';

export const listarFuncionarios = async (req: Request, res: Response) => {
  const funcionarios = await prisma.funcionario.findMany({
    select: {
      id: true,
      nome: true,
      telefone: true,
      endereco: true,
      usuario: true,
      nivelPermissao: true
    }
  });
  
  res.json(funcionarios);
};

export const criarFuncionario = async (req: Request, res: Response) => {
  const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
  
  const senhaHash = await bcrypt.hash(senha, 10);
  
  const funcionario = await prisma.funcionario.create({
    data: {
      nome,
      telefone,
      endereco,
      usuario,
      senha: senhaHash,
      nivelPermissao
    }
  });
  
  res.status(201).json({
    id: funcionario.id,
    nome: funcionario.nome,
    telefone: funcionario.telefone,
    endereco: funcionario.endereco,
    usuario: funcionario.usuario,
    nivelPermissao: funcionario.nivelPermissao
  });
};

export const atualizarFuncionario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
  
  const data: any = { nome, telefone, endereco, usuario, nivelPermissao };
  
  if (senha) {
    data.senha = await bcrypt.hash(senha, 10);
  }
  
  const funcionario = await prisma.funcionario.update({
    where: { id },
    data
  });
  
  res.json(funcionario);
};

export const deletarFuncionario = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.funcionario.delete({
    where: { id }
  });
  
  res.status(204).send();
};