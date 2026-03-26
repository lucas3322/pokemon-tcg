'use client';
import { Grid, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import { PokemonCard } from '@/types';
import CardItem from './CardItem';

interface Props {
  cards: PokemonCard[];
  loading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onAdd?: (card: PokemonCard) => void;
  onInfo?: (card: PokemonCard) => void;
  deckCardCounts?: Record<string, number>;
  emptyMessage?: string;
}

export default function CardGrid({ cards, loading, totalCount, page, pageSize, onPageChange, onAdd, onInfo, deckCardCounts = {}, emptyMessage }: Props) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!loading && cards.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage || 'Nenhuma carta encontrada'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={1.5}>
        {cards.map((card) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={card.id}>
            <CardItem
              card={card}
              onAdd={onAdd}
              onInfo={onInfo}
              addCount={deckCardCounts[card.id] || 0}
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => onPageChange(p)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}
