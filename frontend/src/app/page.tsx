'use client';
import { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import AppLayout from '@/components/AppLayout';
import SearchFilters from '@/components/cards/SearchFilters';
import CardGrid from '@/components/cards/CardGrid';
import CardModal from '@/components/cards/CardModal';
import { PokemonCard, SearchFilters as Filters } from '@/types';
import { cardsApi } from '@/lib/api';

const EMPTY_FILTERS: Filters = { name: '', type: '', set: '', rarity: '' };

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const PAGE_SIZE = 20;

  const doSearch = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const result = await cardsApi.search({ ...filters, page: currentPage, pageSize: PAGE_SIZE });
      setCards(result.data || []);
      setTotalCount(result.totalCount || 0);
      setPage(currentPage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handlePageChange = (p: number) => doSearch(p);

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    setCards([]);
    setHasSearched(false);
    setTotalCount(0);
  };

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{
            background: 'linear-gradient(135deg, #3B4CCA, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5,
          }}>
            Buscar Cartas
          </Typography>
          <Typography color="text.secondary">
            Explore o catálogo completo de cartas do Pokemon TCG
          </Typography>
        </Box>

        <Box sx={{ mb: 3, p: 2.5, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(59,76,202,0.1)', boxShadow: '0 2px 8px rgba(59,76,202,0.06)' }}>
          <SearchFilters filters={filters} onChange={setFilters} onSearch={() => doSearch(1)} onClear={handleClear} />
        </Box>

        {hasSearched && !loading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {totalCount > 0 ? `${totalCount} cartas encontradas` : 'Nenhuma carta encontrada'}
          </Typography>
        )}

        {!hasSearched && !loading && (
          <Box sx={{
            textAlign: 'center', py: 10,
            background: 'radial-gradient(ellipse at center, rgba(59,76,202,0.06) 0%, transparent 70%)',
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Use os filtros acima para buscar cartas
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Pesquise por nome, tipo ou raridade
            </Typography>
          </Box>
        )}

        <CardGrid
          cards={cards}
          loading={loading}
          totalCount={totalCount}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          onInfo={setSelectedCard}
          emptyMessage={hasSearched ? 'Nenhuma carta encontrada com esses filtros' : ''}
        />

        <CardModal card={selectedCard} open={!!selectedCard} onClose={() => setSelectedCard(null)} />
      </Box>
    </AppLayout>
  );
}
