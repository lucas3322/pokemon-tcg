export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  set: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
    images: { symbol: string; logo: string };
  };
  number: string;
  artist?: string;
  rarity?: string;
  legalities: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  images: {
    small: string;
    large: string;
  };
  attacks?: { name: string; cost: string[]; damage: string; text: string }[];
  abilities?: { name: string; text: string; type: string }[];
  weaknesses?: { type: string; value: string }[];
  retreatCost?: string[];
}

export interface DeckCard {
  id?: number;
  deck_id?: string;
  card_id: string;
  card_name: string;
  card_image: string;
  card_supertype: string;
  card_types: string[];
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  format: string;
  cover_card_image: string;
  created_at: string;
  updated_at: string;
  card_count?: number;
  total_cards?: number;
  cards?: DeckCard[];
}

export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images: { symbol: string; logo: string };
  legalities: { standard?: string; expanded?: string; unlimited?: string };
  rotationStatus?: 'out' | 'rotating_soon' | 'safe';
}

export interface SearchFilters {
  name: string;
  type: string;
  set: string;
  rarity: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
