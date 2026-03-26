'use client';
import {
  Dialog, DialogContent, Box, Typography, Grid, Chip, Divider,
  IconButton, useMediaQuery, useTheme, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { PokemonCard } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  Fire: '#EF4444', Water: '#3B82F6', Grass: '#22C55E', Lightning: '#EAB308',
  Psychic: '#A855F7', Fighting: '#F97316', Darkness: '#6B7280', Metal: '#94A3B8',
  Dragon: '#6366F1', Fairy: '#EC4899', Colorless: '#9CA3AF',
};

interface Props {
  card: PokemonCard | null;
  open: boolean;
  onClose: () => void;
  onAdd?: (card: PokemonCard) => void;
}

export default function CardModal({ card, open, onClose, onAdd }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!card) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid rgba(59,76,202,0.1)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <CloseIcon />
        </IconButton>

        <Grid container>
          <Grid item xs={12} sm={5}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', bgcolor: '#EEF2FF' }}>
              <Box
                component="img"
                src={card.images.large}
                alt={card.name}
                sx={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 2, boxShadow: '0 8px 32px rgba(59,76,202,0.2)' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={7}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{card.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{card.supertype} — {card.subtypes?.join(', ')}</Typography>
                </Box>
                {card.hp && (
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">HP</Typography>
                    <Typography variant="h5" fontWeight={800} color="primary.main">{card.hp}</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {card.types?.map(type => (
                  <Chip
                    key={type}
                    label={type}
                    size="small"
                    sx={{
                      bgcolor: TYPE_COLORS[type] ? `${TYPE_COLORS[type]}33` : undefined,
                      color: TYPE_COLORS[type],
                      fontWeight: 600,
                    }}
                  />
                ))}
                {card.rarity && <Chip label={card.rarity} size="small" variant="outlined" />}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {card.abilities?.map((ability, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label={ability.type} size="small" color="secondary" sx={{ fontWeight: 700 }} />
                    <Typography fontWeight={700}>{ability.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{ability.text}</Typography>
                </Box>
              ))}

              {card.attacks?.map((attack, i) => (
                <Box key={i} sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(59,76,202,0.04)', borderRadius: 2, border: '1px solid rgba(59,76,202,0.08)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.25 }}>
                        {attack.cost?.map((c, j) => (
                          <Box key={j} sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: TYPE_COLORS[c] || '#666', flexShrink: 0 }} />
                        ))}
                      </Box>
                      <Typography fontWeight={700}>{attack.name}</Typography>
                    </Box>
                    {attack.damage && <Typography fontWeight={700} color="primary.main">{attack.damage}</Typography>}
                  </Box>
                  {attack.text && <Typography variant="body2" color="text.secondary">{attack.text}</Typography>}
                </Box>
              ))}

              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(59,76,202,0.1)' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Set: {card.set.name} ({card.set.series})
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  #{card.number} • {card.artist && `Art: ${card.artist}`}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                  <Chip
                    label={`Standard: ${card.legalities.standard || 'N/A'}`}
                    size="small"
                    color={card.legalities.standard === 'Legal' ? 'success' : 'default'}
                    sx={{ fontSize: '0.7rem' }}
                  />
                  <Chip
                    label={`Expanded: ${card.legalities.expanded || 'N/A'}`}
                    size="small"
                    color={card.legalities.expanded === 'Legal' ? 'success' : 'default'}
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>

              {onAdd && (
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={() => { onAdd(card); onClose(); }}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Adicionar ao Baralho
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
