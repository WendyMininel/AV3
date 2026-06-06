# AV2

# ✈︎ AEROCODE - Sistema de Gestão de Produção de Aeronaves

Sistema completo para gestão da produção de aeronaves, desenvolvido em React com TypeScript, oferecendo uma interface gráfica moderna e intuitiva (Single Page Application).

## Sobre o Projeto

A **Aerocode** é uma empresa especializada no desenvolvimento de software para auxiliar indústrias brasileiras que constroem aeronaves para aviação civil e militar. Este sistema simula o processo de produção de uma aeronave, desde o cadastro inicial até a entrega final ao cliente

## Relatório
[RELATÓRIO DE WIREFRAME - AV2 - wendy.pdf](https://github.com/user-attachments/files/27543903/RELATORIO.DE.WIREFRAME.-.AV2.-.wendy.pdf)


## Evolução do Sistema

Diferente da versão CLI (Command-Line Interface), esta versão Front-End foi desenvolvida como uma **Single Page Application (SPA)** utilizando **React** e **TypeScript**, oferecendo:

- Interface gráfica intuitiva e amigável
- Navegação fluida sem recarregamento de páginas
- Layout responsivo para diferentes tamanhos de tela
- Componentes reutilizáveis e código modular
- Experiência visual aprimorada
  
## Funcionalidades por Nível de Acesso

### Administrador (Acesso total)
- Cadastrar/Remover Aeronaves
- Cadastrar/Remover Funcionários
- Listar todas as aeronaves e funcionários
- Cadastrar peças e etapas
- Iniciar/Finalizar etapas
- Executar testes
- Gerar relatório final
- Associar funcionários a etapas
- Gerenciar peças do sistema

### Engenheiro
- Cadastrar aeronaves, peças e etapas
- Iniciar e finalizar etapas
- Executar testes
- Gerar relatório final
- Associar funcionários a etapas
- Visualizar peças e listagens

### Operador
- Iniciar e finalizar etapas
- Executar testes
- Visualizar listagens básicas
- Deslogar e sair do sistema

## Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 14 ou superior)
- [TypeScript](https://www.typescriptlang.org/) instalado globalmente

### Passos para execução

1. **Clone o repositório**

2. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Execute o projeto**
   ```bash
   npm start
   ```
   
5. **Acesse no navegador**
   ```bash
   (http://localhost:3000)
   ```

##  Usuários e Senhas de Acesso

O sistema vem com 3 usuários pré-cadastrados para teste:

| Nível | Usuário | Senha | Permissões |
|-------|---------|-------|-------------|
| Administrador | `adm` | `adm001` | Acesso total ao sistema |
| Engenheiro | `eng` | `eng001` | Cadastros, testes, relatórios e produção |
| Operador | `op` | `op001` | Operações básicas de produção |



## Relatórios Gerados

Os relatórios finais das aeronaves prontas para entrega podem ser:

- **Visualizados** na tela de Relatório
- **Baixados** em arquivo de texto (.txt) com nome personalizado

#### Cada relatório contém:
- Informações detalhadas da aeronave
- Nome do cliente e data de entrega
- Etapas realizadas por aeronave
- Peças utilizadas
- Resultados dos testes
- Status final de aprovação
- Data e hora de emissão

## Tecnologias Utilizadas

- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **React Router DOM** - Navegação entre páginas
- **CSS Modules** - Estilização componentizada
- **LocalStorage** - Persistência de dados local
- **Context API** - Gerenciamento de estado global

## Funcionalidades Visuais

- **Timeline interativa** para visualização de etapas
- **Cards animados** com estatísticas do dashboard
- **Filtros e buscas** em listagens
- **Layout responsivo** adaptado para dispositivos móveis
- **Feedback visual** em ações (hover, cliques, transições)
- **Pré-visualização** de relatórios antes do download

## Requisitos de Sistema

- **Windows** 10 ou superior
- **Linux Ubuntu** 24.04.03 ou superior
- Distribuições Linux derivadas do Ubuntu


## Licença

Este é um projeto educacional/demonstrativo. Todos os dados utilizados são fictícios.

Desenvolvido por Wendy Mininel

