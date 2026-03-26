import { PokemonCard, Deck, DeckCard, PokemonSet } from '@/types';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`;

function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export interface SearchParams {
  name?: string;
  type?: string;
  set?: string;
  rarity?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  data: PokemonCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

export const cardsApi = {
  search: async (params: SearchParams): Promise<SearchResult> => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') query.set(k, String(v));
    });
    const res = await fetch(`${API_BASE}/cards?${query}`);
    if (!res.ok) throw new Error('Failed to fetch cards');
    return res.json();
  },

  getById: async (id: string): Promise<{ data: PokemonCard }> => {
    const res = await fetch(`${API_BASE}/cards/${id}`);
    if (!res.ok) throw new Error('Failed to fetch card');
    return res.json();
  },
};

export const decksApi = {
  list: async (token: string): Promise<Deck[]> => {
    const res = await fetch(`${API_BASE}/decks`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch decks');
    return res.json();
  },

  get: async (id: string, token: string): Promise<Deck> => {
    const res = await fetch(`${API_BASE}/decks/${id}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch deck');
    return res.json();
  },

  create: async (data: { name: string; description?: string; format?: string }, token: string): Promise<Deck> => {
    const res = await fetch(`${API_BASE}/decks`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create deck');
    return res.json();
  },

  update: async (id: string, data: Partial<Deck> & { cards?: DeckCard[] }, token: string): Promise<Deck> => {
    const res = await fetch(`${API_BASE}/decks/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update deck');
    return res.json();
  },

  delete: async (id: string, token: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/decks/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete deck');
  },
};

export const rotationApi = {
  get: async (): Promise<{ sets: (PokemonSet & { rotationStatus: string })[]; rotationYear: number; rotationNote: string }> => {
    const res = await fetch(`${API_BASE}/rotation`);
    if (!res.ok) throw new Error('Failed to fetch rotation');
    return res.json();
  },
};
