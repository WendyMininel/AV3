import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Funcionario, NivelPermissao, UsuarioAutenticado } from '../types';
import { authAPI, setAuthToken } from '../services/api';

interface AuthContextData {
  usuario: UsuarioAutenticado | null;
  login: (usuario: string, senha: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (niveisPermitidos: NivelPermissao[]) => boolean;
  atualizarUsuario: (usuarioAtualizado: UsuarioAutenticado) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const funcionariosMock: Funcionario[] = [
  {
    id: '1',
    nome: 'Gerson',
    telefone: '(12) 98283-9273',
    endereco: 'Fatec, 123',
    usuario: 'adm',
    senha: 'adm001',
    nivelPermissao: NivelPermissao.ADMINISTRADOR
  },
  {
    id: '2',
    nome: 'Wendy',
    telefone: '(12) 99752-6999',
    endereco: 'Caçapava-SP, 456',
    usuario: 'eng',
    senha: 'eng001',
    nivelPermissao: NivelPermissao.ENGENHEIRO
  },
  {
    id: '3',
    nome: 'Ana',
    telefone: '(12) 99666-4755',
    endereco: 'Caçapava-SP, 789',
    usuario: 'op',
    senha: 'op001',
    nivelPermissao: NivelPermissao.OPERADOR
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() => {
    const saved = localStorage.getItem('@Aerocode:usuario');
    const token = localStorage.getItem('@Aerocode:token');
    if (saved && token) {
      setAuthToken(token);
      return JSON.parse(saved);
    }
    return null;
  });

  const login = async (usuario: string, senha: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(usuario, senha);
      setAuthToken(response.token);
      const usuarioAutenticado: UsuarioAutenticado = {
        funcionario: response.usuario,
        token: response.token
      };
      setUsuario(usuarioAutenticado);
      localStorage.setItem('@Aerocode:usuario', JSON.stringify(usuarioAutenticado));
      return true;
    } catch (error) {
      const funcionario = funcionariosMock.find(
        f => f.usuario === usuario && f.senha === senha
      );
      if (funcionario) {
        const usuarioAutenticado: UsuarioAutenticado = {
          funcionario,
          token: 'mock-token-' + Date.now()
        };
        setUsuario(usuarioAutenticado);
        localStorage.setItem('@Aerocode:usuario', JSON.stringify(usuarioAutenticado));
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    setAuthToken(null);
    localStorage.removeItem('@Aerocode:usuario');
    localStorage.removeItem('@Aerocode:token');
  };

  const hasPermission = (niveisPermitidos: NivelPermissao[]): boolean => {
    if (!usuario) return false;
    return niveisPermitidos.includes(usuario.funcionario.nivelPermissao);
  };

  const atualizarUsuario = (usuarioAtualizado: UsuarioAutenticado) => {
    setUsuario(usuarioAtualizado);
    localStorage.setItem('@Aerocode:usuario', JSON.stringify(usuarioAtualizado));
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, hasPermission, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);