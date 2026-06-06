const API_URL = 'http://localhost:3333/api';

let authToken: string | null = localStorage.getItem('@Aerocode:token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('@Aerocode:token', token);
  } else {
    localStorage.removeItem('@Aerocode:token');
  }
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> || {})
    }
  };

  console.log('Requisição:', url, finalOptions);

  const response = await fetch(url, finalOptions);
  
  console.log('Resposta:', response.status);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
    throw new Error(error.error || `Erro ${response.status}`);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
};

export const aeronaveAPI = {
  listar: () => request<any[]>('/aeronaves'),
  buscar: (codigo: string) => request<any>(`/aeronaves/${codigo}`),
  criar: (data: any) => request('/aeronaves', { method: 'POST', body: JSON.stringify(data) }),
  deletar: (codigo: string) => request(`/aeronaves/${codigo}`, { method: 'DELETE' })
};

export const pecaAPI = {
  listar: () => request<any[]>('/pecas'),
  criar: (data: any) => request('/pecas', { method: 'POST', body: JSON.stringify(data) }),
  atualizarStatus: (id: string, status: string) => request(`/pecas/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deletar: (id: string) => request(`/pecas/${id}`, { method: 'DELETE' })
};

export const etapaAPI = {
  listar: (aeronaveCodigo?: string) => request<any[]>(`/etapas${aeronaveCodigo ? `?aeronaveCodigo=${aeronaveCodigo}` : ''}`),
  criar: (data: any) => request('/etapas', { method: 'POST', body: JSON.stringify(data) }),
  iniciar: (id: string) => request(`/etapas/${id}/iniciar`, { method: 'PATCH' }),
  finalizar: (id: string) => request(`/etapas/${id}/finalizar`, { method: 'PATCH' }),
  associarFuncionario: (etapaId: string, funcionarioId: string) => 
    request(`/etapas/${etapaId}/funcionarios`, { method: 'POST', body: JSON.stringify({ funcionarioId }) }),
  deletar: (id: string) => request(`/etapas/${id}`, { method: 'DELETE' })
};

export const funcionarioAPI = {
  listar: () => request<any[]>('/funcionarios'),
  criar: (data: any) => request('/funcionarios', { method: 'POST', body: JSON.stringify(data) }),
  atualizarPerfil: (id: string, data: any) => 
    request(`/funcionarios/perfil/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletar: (id: string) => request(`/funcionarios/${id}`, { method: 'DELETE' })
};

export const testeAPI = {
  listar: (aeronaveCodigo?: string) => request<any[]>(`/testes${aeronaveCodigo ? `?aeronaveCodigo=${aeronaveCodigo}` : ''}`),
  criar: (data: any) => request('/testes', { method: 'POST', body: JSON.stringify(data) })
};

export const relatorioAPI = {
  gerar: (data: { aeronaveCodigo: string; cliente: string; dataEntrega: string }) =>
    request<{ relatorio: string }>('/relatorio/gerar', { method: 'POST', body: JSON.stringify(data) })
};

export const authAPI = {
  login: (usuario: string, senha: string) =>
    request<{ token: string; usuario: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ usuario, senha }) })
};