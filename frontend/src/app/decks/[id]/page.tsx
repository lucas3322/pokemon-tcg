'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, TextField, Button, Chip,
  IconButton, Tooltip, CircularProgress,
  LinearProgress, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Snackbar, Alert, InputAdornment,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AppLayout from '@/components/AppLayout';
import CardGrid from '@/components/cards/CardGrid';
import CardModal from '@/components/cards/CardModal';
import { PokemonCard, Deck, DeckCard } from '@/types';
import { cardsApi, decksApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function DeckBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (token) loadDeck();
  }, [id, token]);

  const loadDeck = async () => {
    if (!token) return;
    try {
      const data = await decksApi.get(id, token);
      setDeck(data);
      setDeckName(data.name);
      setDeckDesc(data.description || '');
      setDeckCards(data.cards || []);
    } catch {
      router.push('/decks');
    }
  };

  const doSearch = useCallback(async (page = 1) => {
    if (!searchName && !searchType) return;
    setSearchLoading(true);
    setHasSearched(true);
    try {
      const result = await cardsApi.search({ name: searchName, type: searchType, page, pageSize: 18 });
      setCards(result.data || []);
      setTotalCount(result.totalCount || 0);
      setSearchPage(page);
    } finally {
      setSearchLoading(false);
    }
  }, [searchName, searchType]);

  const totalCards = useMemo(() => deckCards.reduce((sum, c) => sum + c.quantity, 0), [deckCards]);

  const deckCardCounts = useMemo(() => {
    const map: Record<string, number> = {};
    deckCards.forEach(c => { map[c.card_id] = c.quantity; });
    return map;
  }, [deckCards]);

  const addCard = (card: PokemonCard) => {
    const existing = deckCards.find(c => c.card_id === card.id);
    const maxCopies = card.supertype === 'Energy' ? 99 : 4;

    if (totalCards >= 60) {
      setSnackbar({ open: true, message: 'O baralho já tem 60 cartas!', severity: 'error' });
      return;
    }

    if (existing) {
      if (existing.quantity >= maxCopies) {
        setSnackbar({ open: true, message: `Máximo de ${maxCopies} cópias por carta`, severity: 'error' });
        return;
      }
      setDeckCards(prev => prev.map(c => c.card_id === card.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setDeckCards(prev => [...prev, {
        card_id: card.id,
        card_name: card.name,
        card_image: card.images.small,
        card_supertype: card.supertype,
        card_types: card.types || [],
        quantity: 1,
      }]);
    }
  };

  const removeCard = (cardId: string) => {
    setDeckCards(prev => {
      const existing = prev.find(c => c.card_id === cardId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter(c => c.card_id !== cardId);
      return prev.map(c => c.card_id === cardId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  };

  const deleteCard = (cardId: string) => {
    setDeckCards(prev => prev.filter(c => c.card_id !== cardId));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const coverImage = deckCards[0]?.card_image || '';
      await decksApi.update(id, {
        name: deckName,
        description: deckDesc,
        cover_card_image: coverImage,
        cards: deckCards,
      }, token);
      setSnackbar({ open: true, message: 'Baralho salvo com sucesso!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Erro ao salvar baralho', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const groupedCards = useMemo(() => {
    const groups: Record<string, DeckCard[]> = {};
    deckCards.forEach(c => {
      const key = c.card_supertype || 'Outros';
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [deckCards]);

  const TYPES = ['Fire', 'Water', 'Grass', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Dragon', 'Fairy', 'Colorless'];

  if (!deck) {
    return (
      <AppLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box sx={{ height: { md: 'calc(100vh)' }, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid rgba(59,76,202,0.1)', boxShadow: '0 1px 4px rgba(59,76,202,0.06)', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.push('/decks')}><ArrowBackIcon /></IconButton>
          <Box sx={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
              variant="standard"
              sx={{ '& input': { fontSize: '1.3rem', fontWeight: 700 }, minWidth: 200 }}
            />
            <Chip
              label={`${totalCards}/60`}
              color={totalCards === 60 ? 'success' : totalCards > 60 ? 'error' : 'primary'}
              variant="outlined"
            />
          </Box>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left: Card Search */}
          <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 }, borderRight: { md: '1px solid rgba(59,76,202,0.1)' } }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Buscar carta..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch(1)}
                sx={{ flex: 1, minWidth: 160 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment>,
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Tipo</InputLabel>
                <Select value={searchType} onChange={e => setSearchType(e.target.value)} label="Tipo">
                  <MenuItem value="">Todos</MenuItem>
                  {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={() => doSearch(1)} size="small">Buscar</Button>
            </Box>

            <CardGrid
              cards={cards}
              loading={searchLoading}
              totalCount={totalCount}
              page={searchPage}
              pageSize={18}
              onPageChange={doSearch}
              onAdd={addCard}
              onInfo={setSelectedCard}
              deckCardCounts={deckCardCounts}
              emptyMessage={hasSearched ? 'Nenhuma carta encontrada' : 'Busque cartas para adicionar ao baralho'}
            />
          </Box>

          {/* Right: Deck List */}
          <Box sx={{ width: { xs: '100%', md: 320 }, overflow: 'auto', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(59,76,202,0.1)', bgcolor: '#FAFBFF' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={700}>Baralho</Typography>
                <Typography variant="caption" color="text.secondary">{deckCards.length} tipos</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(totalCards / 60) * 100}
                color={totalCards === 60 ? 'success' : 'primary'}
                sx={{ borderRadius: 1, height: 6 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {totalCards}/60 cartas
              </Typography>
            </Box>

            {deckCards.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Adicione cartas buscando à esquerda
                </Typography>
              </Box>
            ) : (
              <Box>
                {Object.entries(groupedCards).map(([group, groupCards]) => (
                  <Box key={group}>
                    <Box sx={{ px: 2, py: 1, bgcolor: 'rgba(59,76,202,0.04)', display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">
                        {group}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {groupCards.reduce((s, c) => s + c.quantity, 0)}
                      </Typography>
                    </Box>
                    <List dense disablePadding>
                      {groupCards.map(dc => (
                        <ListItem key={dc.card_id} sx={{ px: 2, py: 0.5 }}>
                          <ListItemAvatar sx={{ minWidth: 44 }}>
                            <Avatar src={dc.card_image} variant="rounded" sx={{ width: 32, height: 44 }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="body2" noWrap fontWeight={500}>{dc.card_name}</Typography>}
                            secondary={<Typography variant="caption" color="text.secondary">{dc.card_types.join(', ')}</Typography>}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                            <IconButton size="small" onClick={() => removeCard(dc.card_id)} sx={{ p: 0.5 }}>
                              <RemoveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 20, textAlign: 'center' }}>
                              {dc.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                const found = cards.find(c => c.id === dc.card_id);
                                if (found) {
                                  addCard(found);
                                } else {
                                  addCard({ id: dc.card_id, name: dc.card_name, supertype: dc.card_supertype, types: dc.card_types } as PokemonCard);
                                }
                              }}
                              sx={{ p: 0.5 }}
                            >
                              <AddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => deleteCard(dc.card_id)} sx={{ p: 0.5, color: 'error.main', ml: 0.5 }}>
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <CardModal card={selectedCard} open={!!selectedCard} onClose={() => setSelectedCard(null)} onAdd={addCard} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
