'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, Chip, CircularProgress,
  Alert, Tabs, Tab, Avatar
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AppLayout from '@/components/AppLayout';
import { PokemonSet } from '@/types';
import { rotationApi } from '@/lib/api';

type RotationStatus = 'out' | 'rotating_soon' | 'safe';

interface RotationSet extends PokemonSet {
  rotationStatus: RotationStatus;
}

const STATUS_CONFIG = {
  safe: {
    label: 'No Padrão',
    color: '#4CAF50' as const,
    bg: 'rgba(76, 175, 80, 0.1)',
    icon: <CheckCircleIcon sx={{ color: '#4CAF50' }} />,
    chipColor: 'success' as const,
  },
  rotating_soon: {
    label: 'Rotacionando em 2026',
    color: '#FF9800' as const,
    bg: 'rgba(255, 152, 0, 0.1)',
    icon: <WarningAmberIcon sx={{ color: '#FF9800' }} />,
    chipColor: 'warning' as const,
  },
  out: {
    label: 'Fora do Padrão',
    color: '#9E9E9E' as const,
    bg: 'rgba(158, 158, 158, 0.05)',
    icon: <CancelIcon sx={{ color: '#666' }} />,
    chipColor: 'default' as const,
  },
};

export default function RotationPage() {
  const [sets, setSets] = useState<RotationSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [tab, setTab] = useState<'all' | RotationStatus>('all');

  useEffect(() => {
    rotationApi.get().then(data => {
      setSets(data.sets as RotationSet[]);
      setNote(data.rotationNote);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? sets : sets.filter(s => s.rotationStatus === tab);
  const counts = {
    safe: sets.filter(s => s.rotationStatus === 'safe').length,
    rotating_soon: sets.filter(s => s.rotationStatus === 'rotating_soon').length,
    out: sets.filter(s => s.rotationStatus === 'out').length,
  };

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <AutorenewIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #3B4CCA, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Rotação de Sets
            </Typography>
          </Box>
          <Typography color="text.secondary">Acompanhe quais sets estão no formato Standard</Typography>
        </Box>

        {note && (
          <Alert severity="info" sx={{ mb: 3, bgcolor: 'rgba(33, 150, 243, 0.1)', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
            {note}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { status: 'safe' as const, label: 'No Padrão', count: counts.safe, desc: 'Válidos no Standard' },
            { status: 'rotating_soon' as const, label: 'Rotacionando', count: counts.rotating_soon, desc: 'Saem em 2026' },
            { status: 'out' as const, label: 'Fora do Padrão', count: counts.out, desc: 'Apenas Unlimited/Expanded' },
          ].map(item => {
            const config = STATUS_CONFIG[item.status];
            return (
              <Grid item xs={12} sm={4} key={item.status}>
                <Card sx={{
                  p: 2.5,
                  background: `linear-gradient(135deg, ${config.bg}, transparent)`,
                  border: `1px solid ${config.color}33`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' },
                  ...(tab === item.status && { borderColor: config.color, boxShadow: `0 0 20px ${config.color}33` }),
                }} onClick={() => setTab(tab === item.status ? 'all' : item.status)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h3" fontWeight={800} sx={{ color: config.color }}>{item.count}</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                    </Box>
                    <Box sx={{ fontSize: 40 }}>{config.icon}</Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
        >
          <Tab value="all" label={`Todos (${sets.length})`} />
          <Tab value="safe" label={`No Padrão (${counts.safe})`} />
          <Tab value="rotating_soon" label={`Rotacionando (${counts.rotating_soon})`} />
          <Tab value="out" label={`Fora (${counts.out})`} />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filtered.map(set => {
              const config = STATUS_CONFIG[set.rotationStatus];
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={set.id}>
                  <Card sx={{
                    p: 0,
                    overflow: 'hidden',
                    opacity: set.rotationStatus === 'out' ? 0.6 : 1,
                    border: `1px solid ${set.rotationStatus === 'rotating_soon' ? '#F59E0B44' : 'rgba(59,76,202,0.08)'}`,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}>
                    <Box sx={{ height: 4, bgcolor: config.color }} />
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        {set.images?.symbol ? (
                          <Box component="img" src={set.images.symbol} alt={set.name} sx={{ width: 28, height: 28, objectFit: 'contain' }} />
                        ) : (
                          <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(59,76,202,0.1)', color: 'primary.main', fontSize: 14 }}>
                            {set.name[0]}
                          </Avatar>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>{set.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{set.series}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(set.releaseDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {set.total} cartas
                          </Typography>
                        </Box>
                        <Chip
                          icon={set.rotationStatus === 'rotating_soon' ? <WarningAmberIcon /> : undefined}
                          label={config.label}
                          size="small"
                          color={config.chipColor}
                          sx={{ fontSize: '0.65rem', fontWeight: 700 }}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </AppLayout>
  );
}
