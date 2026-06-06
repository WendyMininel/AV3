import { Request, Response } from 'express';
import { prisma } from '../index';

export const gerarRelatorio = async (req: Request, res: Response) => {
  const { aeronaveCodigo, cliente, dataEntrega } = req.body;
  
  const aeronave = await prisma.aeronave.findUnique({
    where: { codigo: aeronaveCodigo },
    include: {
      etapas: true,
      testes: true
    }
  });
  
  if (!aeronave) {
    return res.status(404).json({ error: 'Aeronave não encontrada' });
  }
  
  const pecas = await prisma.peca.findMany();
  
  const etapasConcluidas = aeronave.etapas.filter(e => e.status === 'CONCLUIDA');
  const testesAprovados = aeronave.testes.filter(t => t.resultado === 'APROVADO');
  
  const statusAprovacao = etapasConcluidas.length > 0 && testesAprovados.length === aeronave.testes.length
    ? 'APROVADA'
    : 'PENDENTE DE VERIFICAÇÃO';
  
  const relatorio = `
AEROCODE - RELATÓRIO FINAL

Data de emissão: ${new Date().toLocaleDateString('pt-BR')}
Horário: ${new Date().toLocaleTimeString('pt-BR')}

DADOS DO CLIENTE
Cliente: ${cliente}
Data de Entrega: ${new Date(dataEntrega).toLocaleDateString('pt-BR')}

DADOS DA AERONAVE
Código: ${aeronave.codigo}
Modelo: ${aeronave.modelo}
Tipo: ${aeronave.tipo === 'COMERCIAL' ? 'Comercial' : 'Militar'}
Capacidade: ${aeronave.capacidade} ${aeronave.tipo === 'COMERCIAL' ? 'passageiros' : 'pessoas'}
Alcance: ${aeronave.alcance} km

ETAPAS REALIZADAS (${etapasConcluidas.length})
${etapasConcluidas.map((e, i) => `${i + 1}. ${e.nome} - Concluída em ${new Date(e.prazo).toLocaleDateString('pt-BR')}`).join('\n')}

PEÇAS UTILIZADAS
${pecas.map(p => `• ${p.nome}
  - Tipo: ${p.tipo === 'NACIONAL' ? 'Nacional' : 'Importada'}
  - Fornecedor: ${p.fornecedor}
  - Status: ${p.status === 'PRONTA' ? 'Pronta para uso' : 'Em processamento'}`).join('\n\n')}

RESULTADOS DOS TESTES (${aeronave.testes.length})
${aeronave.testes.map(t => `• Teste ${t.tipo}: ${t.resultado === 'APROVADO' ? 'APROVADO' : 'REPROVADO'}`).join('\n')}

STATUS FINAL
Status: ${statusAprovacao}

AERONAVE ${statusAprovacao}

Assinatura digital: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
  `;
  
  res.json({ relatorio });
};