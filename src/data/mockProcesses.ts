export type GateStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type ChecklistStatus = 'pending' | 'ok' | 'blocked';
export type ProcessStatus = 'APTO' | 'NAO_APTO';

export interface Gate {
  id: string;
  title: string;
  description: string;
  status: GateStatus;
}

export interface ChecklistItem {
  id: string;
  title: string;
  status: ChecklistStatus;
  evidence: string;
  notes: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Process {
  id: string;
  numero: string;
  protocolo: string;
  requerente: string;
  rt: string;
  imovel: string;
  matricula: string;
  status: ProcessStatus;
  progress: number;
  lastUpdate: string;
  gates: Gate[];
  checklistSections: ChecklistSection[];
}

export const mockProcesses: Process[] = [
  {
    id: '1',
    numero: 'ZRPI-2024-001',
    protocolo: 'PROTO-2024-00125',
    requerente: 'João Silva Construtora Ltda.',
    rt: 'Eng. Maria Santos - CREA 12345',
    imovel: 'Lote 15, Quadra 8, Loteamento Mar Azul',
    matricula: '12.345',
    status: 'NAO_APTO',
    progress: 65,
    lastUpdate: '2024-01-15T10:30:00',
    gates: [
      { id: 'g1', title: 'Documentação Pessoal', description: 'RG, CPF e comprovantes do requerente', status: 'completed' },
      { id: 'g2', title: 'Matrícula Atualizada', description: 'Certidão de matrícula com menos de 30 dias', status: 'completed' },
      { id: 'g3', title: 'ART/RRT', description: 'Anotação de responsabilidade técnica válida', status: 'in_progress' },
      { id: 'g4', title: 'Projeto Arquitetônico', description: 'Plantas baixas, cortes e fachadas', status: 'pending' },
      { id: 'g5', title: 'Memorial Descritivo', description: 'Especificações técnicas da construção', status: 'pending' },
      { id: 'g6', title: 'Licenças Ambientais', description: 'Autorizações de órgãos ambientais', status: 'blocked' },
    ],
    checklistSections: [
      {
        id: 's1',
        title: 'Documentos do Requerente',
        items: [
          { id: 'c1', title: 'RG ou CNH do proprietário', status: 'ok', evidence: 'Doc anexado', notes: '' },
          { id: 'c2', title: 'CPF do proprietário', status: 'ok', evidence: 'Validado na RFB', notes: '' },
          { id: 'c3', title: 'Comprovante de residência', status: 'pending', evidence: '', notes: '' },
          { id: 'c4', title: 'Contrato social (se PJ)', status: 'ok', evidence: 'CNPJ ativo', notes: 'Verificar sócios' },
        ],
      },
      {
        id: 's2',
        title: 'Documentos do Imóvel',
        items: [
          { id: 'c5', title: 'Matrícula atualizada (30 dias)', status: 'ok', evidence: 'Emitida 10/01/2024', notes: '' },
          { id: 'c6', title: 'Certidão negativa de débitos', status: 'pending', evidence: '', notes: '' },
          { id: 'c7', title: 'IPTU do exercício', status: 'blocked', evidence: '', notes: 'Aguardando prefeitura' },
          { id: 'c8', title: 'Croqui de localização', status: 'ok', evidence: 'Anexado', notes: '' },
        ],
      },
      {
        id: 's3',
        title: 'Projeto Técnico',
        items: [
          { id: 'c9', title: 'Planta baixa', status: 'pending', evidence: '', notes: '' },
          { id: 'c10', title: 'Planta de situação', status: 'pending', evidence: '', notes: '' },
          { id: 'c11', title: 'Cortes e fachadas', status: 'pending', evidence: '', notes: '' },
          { id: 'c12', title: 'Memorial descritivo', status: 'pending', evidence: '', notes: '' },
        ],
      },
    ],
  },
  {
    id: '2',
    numero: 'ZRPI-2024-002',
    protocolo: 'PROTO-2024-00198',
    requerente: 'Construtora Oceano Verde S.A.',
    rt: 'Arq. Pedro Oliveira - CAU 54321',
    imovel: 'Gleba Rural, Estrada do Mar km 5',
    matricula: '45.678',
    status: 'APTO',
    progress: 100,
    lastUpdate: '2024-01-14T16:45:00',
    gates: [
      { id: 'g1', title: 'Documentação Pessoal', description: 'RG, CPF e comprovantes do requerente', status: 'completed' },
      { id: 'g2', title: 'Matrícula Atualizada', description: 'Certidão de matrícula com menos de 30 dias', status: 'completed' },
      { id: 'g3', title: 'ART/RRT', description: 'Anotação de responsabilidade técnica válida', status: 'completed' },
      { id: 'g4', title: 'Projeto Arquitetônico', description: 'Plantas baixas, cortes e fachadas', status: 'completed' },
      { id: 'g5', title: 'Memorial Descritivo', description: 'Especificações técnicas da construção', status: 'completed' },
      { id: 'g6', title: 'Licenças Ambientais', description: 'Autorizações de órgãos ambientais', status: 'completed' },
    ],
    checklistSections: [
      {
        id: 's1',
        title: 'Documentos do Requerente',
        items: [
          { id: 'c1', title: 'RG ou CNH do proprietário', status: 'ok', evidence: 'Doc anexado', notes: '' },
          { id: 'c2', title: 'CPF do proprietário', status: 'ok', evidence: 'Validado', notes: '' },
          { id: 'c3', title: 'Comprovante de residência', status: 'ok', evidence: 'Conta de luz', notes: '' },
          { id: 'c4', title: 'Contrato social (se PJ)', status: 'ok', evidence: 'CNPJ ativo', notes: '' },
        ],
      },
      {
        id: 's2',
        title: 'Documentos do Imóvel',
        items: [
          { id: 'c5', title: 'Matrícula atualizada (30 dias)', status: 'ok', evidence: 'OK', notes: '' },
          { id: 'c6', title: 'Certidão negativa de débitos', status: 'ok', evidence: 'Sem débitos', notes: '' },
          { id: 'c7', title: 'IPTU do exercício', status: 'ok', evidence: 'Quitado', notes: '' },
          { id: 'c8', title: 'Croqui de localização', status: 'ok', evidence: 'Anexado', notes: '' },
        ],
      },
      {
        id: 's3',
        title: 'Projeto Técnico',
        items: [
          { id: 'c9', title: 'Planta baixa', status: 'ok', evidence: 'Aprovada', notes: '' },
          { id: 'c10', title: 'Planta de situação', status: 'ok', evidence: 'Aprovada', notes: '' },
          { id: 'c11', title: 'Cortes e fachadas', status: 'ok', evidence: 'Aprovada', notes: '' },
          { id: 'c12', title: 'Memorial descritivo', status: 'ok', evidence: 'Aprovado', notes: '' },
        ],
      },
    ],
  },
  {
    id: '3',
    numero: 'ZRPI-2024-003',
    protocolo: 'PROTO-2024-00234',
    requerente: 'Marina Ferreira Santos',
    rt: 'Eng. Carlos Lima - CREA 67890',
    imovel: 'Lote 22, Quadra 3, Balneário Praia Grande',
    matricula: '78.901',
    status: 'NAO_APTO',
    progress: 25,
    lastUpdate: '2024-01-13T09:15:00',
    gates: [
      { id: 'g1', title: 'Documentação Pessoal', description: 'RG, CPF e comprovantes do requerente', status: 'completed' },
      { id: 'g2', title: 'Matrícula Atualizada', description: 'Certidão de matrícula com menos de 30 dias', status: 'in_progress' },
      { id: 'g3', title: 'ART/RRT', description: 'Anotação de responsabilidade técnica válida', status: 'pending' },
      { id: 'g4', title: 'Projeto Arquitetônico', description: 'Plantas baixas, cortes e fachadas', status: 'pending' },
      { id: 'g5', title: 'Memorial Descritivo', description: 'Especificações técnicas da construção', status: 'pending' },
      { id: 'g6', title: 'Licenças Ambientais', description: 'Autorizações de órgãos ambientais', status: 'pending' },
    ],
    checklistSections: [
      {
        id: 's1',
        title: 'Documentos do Requerente',
        items: [
          { id: 'c1', title: 'RG ou CNH do proprietário', status: 'ok', evidence: 'CNH válida', notes: '' },
          { id: 'c2', title: 'CPF do proprietário', status: 'ok', evidence: 'Validado', notes: '' },
          { id: 'c3', title: 'Comprovante de residência', status: 'pending', evidence: '', notes: '' },
          { id: 'c4', title: 'Contrato social (se PJ)', status: 'ok', evidence: 'N/A - PF', notes: 'Pessoa física' },
        ],
      },
      {
        id: 's2',
        title: 'Documentos do Imóvel',
        items: [
          { id: 'c5', title: 'Matrícula atualizada (30 dias)', status: 'pending', evidence: '', notes: 'Solicitar nova certidão' },
          { id: 'c6', title: 'Certidão negativa de débitos', status: 'pending', evidence: '', notes: '' },
          { id: 'c7', title: 'IPTU do exercício', status: 'pending', evidence: '', notes: '' },
          { id: 'c8', title: 'Croqui de localização', status: 'pending', evidence: '', notes: '' },
        ],
      },
      {
        id: 's3',
        title: 'Projeto Técnico',
        items: [
          { id: 'c9', title: 'Planta baixa', status: 'pending', evidence: '', notes: '' },
          { id: 'c10', title: 'Planta de situação', status: 'pending', evidence: '', notes: '' },
          { id: 'c11', title: 'Cortes e fachadas', status: 'pending', evidence: '', notes: '' },
          { id: 'c12', title: 'Memorial descritivo', status: 'pending', evidence: '', notes: '' },
        ],
      },
    ],
  },
  {
    id: '4',
    numero: 'ZRPI-2024-004',
    protocolo: 'PROTO-2024-00267',
    requerente: 'Incorporadora Sol Nascente Ltda.',
    rt: 'Eng. Ana Paula Ramos - CREA 11223',
    imovel: 'Área Industrial, Rod. SC-415 km 12',
    matricula: '99.100',
    status: 'NAO_APTO',
    progress: 45,
    lastUpdate: '2024-01-12T14:20:00',
    gates: [
      { id: 'g1', title: 'Documentação Pessoal', description: 'RG, CPF e comprovantes do requerente', status: 'completed' },
      { id: 'g2', title: 'Matrícula Atualizada', description: 'Certidão de matrícula com menos de 30 dias', status: 'completed' },
      { id: 'g3', title: 'ART/RRT', description: 'Anotação de responsabilidade técnica válida', status: 'completed' },
      { id: 'g4', title: 'Projeto Arquitetônico', description: 'Plantas baixas, cortes e fachadas', status: 'blocked' },
      { id: 'g5', title: 'Memorial Descritivo', description: 'Especificações técnicas da construção', status: 'pending' },
      { id: 'g6', title: 'Licenças Ambientais', description: 'Autorizações de órgãos ambientais', status: 'blocked' },
    ],
    checklistSections: [
      {
        id: 's1',
        title: 'Documentos do Requerente',
        items: [
          { id: 'c1', title: 'RG ou CNH do proprietário', status: 'ok', evidence: 'Anexado', notes: '' },
          { id: 'c2', title: 'CPF do proprietário', status: 'ok', evidence: 'Validado', notes: '' },
          { id: 'c3', title: 'Comprovante de residência', status: 'ok', evidence: 'Conta', notes: '' },
          { id: 'c4', title: 'Contrato social (se PJ)', status: 'ok', evidence: 'CNPJ ativo', notes: '' },
        ],
      },
      {
        id: 's2',
        title: 'Documentos do Imóvel',
        items: [
          { id: 'c5', title: 'Matrícula atualizada (30 dias)', status: 'ok', evidence: 'OK', notes: '' },
          { id: 'c6', title: 'Certidão negativa de débitos', status: 'ok', evidence: 'Sem débitos', notes: '' },
          { id: 'c7', title: 'IPTU do exercício', status: 'blocked', evidence: '', notes: 'Débito em aberto' },
          { id: 'c8', title: 'Croqui de localização', status: 'ok', evidence: 'Anexado', notes: '' },
        ],
      },
      {
        id: 's3',
        title: 'Projeto Técnico',
        items: [
          { id: 'c9', title: 'Planta baixa', status: 'blocked', evidence: '', notes: 'Área de preservação' },
          { id: 'c10', title: 'Planta de situação', status: 'pending', evidence: '', notes: '' },
          { id: 'c11', title: 'Cortes e fachadas', status: 'pending', evidence: '', notes: '' },
          { id: 'c12', title: 'Memorial descritivo', status: 'pending', evidence: '', notes: '' },
        ],
      },
    ],
  },
];
