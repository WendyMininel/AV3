import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

export const login = async (req: Request, res: Response) => {
  const { usuario, senha } = req.body;
  
  const funcionario = await prisma.funcionario.findUnique({
    where: { usuario }
  });
  
  if (!funcionario) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }
  
  const senhaValida = await bcrypt.compare(senha, funcionario.senha);
  
  if (!senhaValida) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }
  
  const token = jwt.sign(
    {
      id: funcionario.id,
      nome: funcionario.nome,
      nivelPermissao: funcionario.nivelPermissao
    },
    process.env.JWT_SECRET!,
    { expiresIn: '8h' }
  );
  
  res.json({
    token,
    usuario: {
      id: funcionario.id,
      nome: funcionario.nome,
      usuario: funcionario.usuario,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      nivelPermissao: funcionario.nivelPermissao
    }
  });
};

export const me = async (req: any, res: Response) => {
  const funcionario = await prisma.funcionario.findUnique({
    where: { id: req.usuario.id }
  });
  
  if (!funcionario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  res.json({
    id: funcionario.id,
    nome: funcionario.nome,
    usuario: funcionario.usuario,
    telefone: funcionario.telefone,
    endereco: funcionario.endereco,
    nivelPermissao: funcionario.nivelPermissao
  });
};