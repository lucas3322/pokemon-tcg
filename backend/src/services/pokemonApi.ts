import axios from 'axios';

const BASE_URL = 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.POKEMON_TCG_API_KEY;

const headers: Record<string, string> = {};
if (API_KEY) {
  headers['X-Api-Key'] = API_KEY;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers,
});

export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  abilities?: { name: string; text: string; type: string }[];
  attacks?: { name: string; cost: string[]; convertedEnergyCost: number; damage: string; text: string }[];
  weaknesses?: { type: string; value: string }[];
  resistances?: { type: string; value: string }[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: { symbol: string; logo: string };
  };
  number: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  images: {
    small: string;
    large: string;
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices: Record<string, number>;
  };
}

export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  ptcgoCode?: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
}

export const searchCards = async (params: {
  q?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
}) => {
  const response = await apiClient.get('/cards', { params });
  return response.data;
};

export const getCard = async (id: string) => {
  const response = await apiClient.get(`/cards/${id}`);
  return response.data;
};

export const getSets = async () => {
  const response = await apiClient.get('/sets', {
    params: { orderBy: '-releaseDate' },
  });
  return response.data;
};
