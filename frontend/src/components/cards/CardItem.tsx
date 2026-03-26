'use client';
import { useState } from 'react';
import { Box, Card, CardMedia, Chip, Tooltip, IconButton, Typography, Skeleton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PokemonCard } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  Fire: '#EF4444', Water: '#3B82F6', Grass: '#22C55E', Lightning: '#EAB308',
  Psychic: '#A855F7', Fighting: '#F97316', Darkness: '#6B7280', Metal: '#94A3B8',
  Dragon: '#6366F1', Fairy: '#EC4899', Colorless: '#9CA3AF',
};

interface Props {
  card: PokemonCard;
  onAdd?: (card: PokemonCard) => void;
  onInfo?: (card: PokemonCard) => void;
  addCount?: number;
}

export default function CardItem({ card, onAdd, onInfo, addCount = 0 }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Card
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 12px 32px rgba(59,76,202,0.18)',
          '& .card-actions': { opacity: 1 },
        },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '2.5/3.5', bgcolor: '#EEF2FF' }}>
        {!imgLoaded && (
          <Skeleton variant="rectangular" sx={{ width: '100%', height: '100%' }} />
        )}
        <CardMedia
          component="img"
          image={card.images.small}
          alt={card.name}
          onLoad={() => setImgLoaded(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
        />

        {addCount > 0 && (
          <Box sx={{
            position: 'absolute', top: 8, right: 8,
            width: 24, height: 24, borderRadius: '50%',
            bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(59,76,202,0.4)',
          }}>
            <Typography variant="caption" fontWeight={700} color="white">{addCount}</Typography>
          </Box>
        )}

        <Box
          className="card-actions"
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 1, p: 1,
            background: 'linear-gradient(transparent, rgba(30,42,74,0.7))',
            opacity: 0, transition: 'opacity 0.2s',
          }}
        >
          {onInfo && (
            <Tooltip title="Ver detalhes">
              <IconButton size="small" onClick={() => onInfo(card)} sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'primary.main' }}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onAdd && (
            <Tooltip title="Adicionar ao baralho">
              <IconButton size="small" onClick={() => onAdd(card)} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                <AddCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 1 }}>
        <Typography variant="caption" fontWeight={600} noWrap display="block" title={card.name} color="text.primary">
          {card.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
          {card.types?.slice(0, 2).map(type => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{
                height: 16, fontSize: '0.6rem',
                bgcolor: TYPE_COLORS[type] ? `${TYPE_COLORS[type]}18` : 'rgba(0,0,0,0.06)',
                color: TYPE_COLORS[type] || 'text.secondary',
                fontWeight: 600,
                border: `1px solid ${TYPE_COLORS[type] ? `${TYPE_COLORS[type]}30` : 'transparent'}`,
              }}
            />
          ))}
          {card.rarity && (
            <Chip label={card.rarity} size="small" sx={{ height: 16, fontSize: '0.6rem', opacity: 0.6 }} />
          )}
        </Box>
      </Box>
    </Card>
  );
}
