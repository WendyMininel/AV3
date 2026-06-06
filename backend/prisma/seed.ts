import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.etapaFuncionario.deleteMany();
  await prisma.teste.deleteMany();
  await prisma.etapa.deleteMany();
  await prisma.peca.deleteMany();
  await prisma.aeronave.deleteMany();
  await prisma.funcionario.deleteMany();
  await prisma.metricaLatencia.deleteMany();

  await prisma.funcionario.createMany({
    data: [
      {
        id: '1',
        nome: 'Gerson',
        telefone: '(12) 98283-9273',
        endereco: 'Fatec, 123',
        usuario: 'adm',
        senha: 'adm001',
        nivelPermissao: 'ADMINISTRADOR',
      },
      {
        id: '2',
        nome: 'Wendy',
        telefone: '(12) 99752-6999',
        endereco: 'Caçapava-SP, 456',
        usuario: 'eng',
        senha: 'eng001',
        nivelPermissao: 'ENGENHEIRO',
      },
      {
        id: '3',
        nome: 'Ana',
        telefone: '(12) 99666-4755',
        endereco: 'Caçapava, Rua Lírios-SP, 789',
        usuario: 'op',
        senha: 'op001',
        nivelPermissao: 'OPERADOR',
      },
    ],
  });

  console.log('Inserindo dados iniciais...');
  console.log('Dados iniciais inseridos!');
  console.log('3 usuários criados (adm, eng, op)');
  console.log('Todas as outras tabelas estão vazias');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());