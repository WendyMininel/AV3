# ✈︎ AEROCODE - Sistema de Gestão de Produção de Aeronaves

Sistema completo para gestão da produção de aeronaves, desenvolvido em React com TypeScript, oferecendo uma interface gráfica moderna e intuitiva (Single Page Application).

## Sobre o Projeto

A **Aerocode** é uma empresa especializada no desenvolvimento de software para auxiliar indústrias brasileiras que constroem aeronaves para aviação civil e militar. Este sistema simula o processo de produção de uma aeronave, desde o cadastro inicial até a entrega final ao cliente

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
- Visualizar métricas de performance
- Gerenciar perfil próprio


### Engenheiro
- Cadastrar aeronaves, peças e etapas
- Iniciar e finalizar etapas
- Executar testes
- Gerar relatório final
- Associar funcionários a etapas
- Visualizar peças e listagens
- Visualizar métricas de performance
- Gerenciar perfil próprio

### Operador
- Iniciar e finalizar etapas
- Executar testes
- Visualizar listagens básicas
- Deslogar e sair do sistema
- Gerenciar perfil próprio
  

### Passos para execução

1. **Clone o repositório**
   
2. **Abra o MySQL Workbench e execute o script MySQL.sql**
   
3. **No terminal backend**
   ```bash
   cd backend
   npm install express cors helmet morgan express-rate-limit jsonwebtoken bcryptjs @prisma/client
   npm install -D typescript @types/node @types/express @types/cors @types/morgan @types/jsonwebtoken @types/bcryptjs ts-node-dev prisma
   npx prisma generate
   npx prisma db seed
   npm run dev

   ```

4. **Em outro terminal frontend**
   ```bash
   cd frontend
   npm install react@18.2.0 react-dom@18.2.0 react-router-dom@7.15.0 react-scripts@5.0.1
   npm install -D @types/react@18.2.0 @types/react-dom@18.2.0 @types/react-router-dom@5.3.3 typescript@4.9.5
   npm install chart.js react-chartjs-2
   npm start
   ```
   
5. **Acesse no navegador**


##  Usuários e Senhas de Acesso

O sistema vem com 3 usuários pré-cadastrados para teste:

| Nível | Usuário | Senha | Permissões |
|-------|---------|-------|-------------|
| Administrador | `adm` | `adm001` | Acesso total ao sistema |
| Engenheiro | `eng` | `eng001` | Cadastros, testes, relatórios e produção |
| Operador | `op` | `op001` | Operações básicas de produção |


## Tecnologias Utilizadas

### Front-end
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática e segurança
- **React Router DOM** - Navegação entre páginas
- **Chart.js** - Gráficos interativos para métricas
- **CSS Modules** - Estilização componentizada

### Back-end
- **Node.js** - Plataforma de execução
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Mapeamento objeto-relacional
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação segura


### Ferramentas de Qualidade
- Middleware de métricas (latência, tempo de resposta, processamento)
- Teste de carga para 1, 5 e 10 usuários simultâneos
- Relatórios em PDF e TXT
- Gráficos de performance

 ## Métricas de Performance

O sistema monitora e exibe as seguintes métricas:

| Métrica                 | Descrição                                                  |                     
|--------------------------|--------------------------------------------------------------|
| Latência                 | Tempo de ida e volta da requisição na rede                  |
| Tempo de Processamento   | Tempo gasto pelo servidor para processar                    |
| Tempo de Resposta        | Latência + Tempo de Processamento                           |

### Cenários de Teste

Os testes são realizados com os seguintes cenários de carga:

| Usuários Simultâneos |
|----------------------|
| 1 usuário            |
| 5 usuários           |
| 10 usuários          |


## Requisitos de Sistema

- **Windows** 10 ou superior
- **Linux Ubuntu** 24.04.03 ou superior
- Distribuições Linux derivadas do Ubuntu


## Licença
Desenvolvido por Wendy Mininel

