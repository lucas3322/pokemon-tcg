'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, Button, IconButton,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StyleIcon from '@mui/icons-material/Style';
import AppLayout from '@/components/AppLayout';
import { Deck } from '@/types';
import { decksApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function DecksPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (token) loadDecks();
  }, [token]);

  const loadDecks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await decksApi.list(token);
      setDecks(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newDeckName.trim() || !token) return;
    setCreating(true);
    try {
      const deck = await decksApi.create({ name: newDeckName.trim(), description: newDeckDesc.trim() }, token);
      setCreateOpen(false);
      setNewDeckName('');
      setNewDeckDesc('');
      router.push(`/decks/${deck.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    await decksApi.delete(deleteId, token);
    setDeleteId(null);
    loadDecks();
  };

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #3B4CCA, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}>
              Meus Baralhos
            </Typography>
            <Typography color="text.secondary">{decks.length} baralho{decks.length !== 1 ? 's' : ''} criado{decks.length !== 1 ? 's' : ''}</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            size="large"
          >
            Novo Baralho
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : decks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, background: 'radial-gradient(ellipse at center, rgba(59,76,202,0.06) 0%, transparent 70%)' }}>
            <StyleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>Nenhum baralho ainda</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)} sx={{ mt: 1 }}>
              Criar primeiro baralho
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {decks.map(deck => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={deck.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
                }}>
                  <Box sx={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: deck.cover_card_image
                      ? `url(${deck.cover_card_image}) center/cover`
                      : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                  }}>
                    {!deck.cover_card_image && (
                      <StyleIcon sx={{ fontSize: 48, color: 'rgba(59,76,202,0.15)' }} />
                    )}
                    <Box sx={{
                      position: 'absolute', bottom: 8, right: 8,
                      bgcolor: 'rgba(59,76,202,0.85)', borderRadius: 2, px: 1.5, py: 0.5,
                    }}>
                      <Typography variant="caption" fontWeight={700} color="white">
                        {deck.total_cards || 0}/60
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flex: 1, pb: 1 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{deck.name}</Typography>
                    {deck.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {deck.description}
                      </Typography>
                    )}
                    <Chip label={deck.format} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button size="small" variant="contained" startIcon={<EditIcon />} onClick={() => router.push(`/decks/${deck.id}`)} fullWidth>
                      Editar
                    </Button>
                    <Tooltip title="Deletar baralho">
                      <IconButton size="small" color="error" onClick={() => setDeleteId(deck.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Dialog */}
        <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Criar Novo Baralho</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus fullWidth label="Nome do Baralho" value={newDeckName}
              onChange={e => setNewDeckName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              sx={{ mt: 1, mb: 2 }}
            />
            <TextField
              fullWidth label="Descrição (opcional)" value={newDeckDesc}
              onChange={e => setNewDeckDesc(e.target.value)}
              multiline rows={2}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate} disabled={!newDeckName.trim() || creating}>
              {creating ? 'Criando...' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
          <DialogTitle>Deletar Baralho</DialogTitle>
          <DialogContent>
            <Typography>Tem certeza que deseja deletar este baralho? Esta ação não pode ser desfeita.</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Deletar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AppLayout>
  );
}
