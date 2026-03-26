'use client';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { SearchFilters as Filters } from '@/types';

const POKEMON_TYPES = ['Fire', 'Water', 'Grass', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Dragon', 'Fairy', 'Colorless'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Rare Ultra', 'Rare Secret', 'Amazing Rare', 'Trainer Gallery Rare Holo', 'LEGEND'];

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchFilters({ filters, onChange, onSearch, onClear }: Props) {
  const update = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <TextField
        label="Nome da carta"
        value={filters.name}
        onChange={e => update('name', e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
        size="small"
        sx={{ minWidth: 220, flexGrow: 1 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
        }}
      />

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Tipo</InputLabel>
        <Select value={filters.type} onChange={e => update('type', e.target.value)} label="Tipo">
          <MenuItem value="">Todos</MenuItem>
          {POKEMON_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Raridade</InputLabel>
        <Select value={filters.rarity} onChange={e => update('rarity', e.target.value)} label="Raridade">
          <MenuItem value="">Todas</MenuItem>
          {RARITIES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={onSearch} startIcon={<SearchIcon />}>
        Buscar
      </Button>
      <Button variant="outlined" onClick={onClear} startIcon={<ClearIcon />} color="inherit">
        Limpar
      </Button>
    </Box>
  );
}
