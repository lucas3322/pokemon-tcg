'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, TextField, Button, Typography, Alert, Link, InputAdornment, IconButton, Divider
} from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F0F4FF 100%)',
      p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3B4CCA, #5B6FE8)',
            boxShadow: '0 8px 24px rgba(59,76,202,0.3)',
            mb: 2,
          }}>
            <CatchingPokemonIcon sx={{ fontSize: 40, color: '#FFDE00' }} />
          </Box>
          <Typography variant="h4" fontWeight={800} sx={{
            background: 'linear-gradient(135deg, #3B4CCA, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Pokemon TCG
          </Typography>
          <Typography color="text.secondary" variant="body2">Manager</Typography>
        </Box>

        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(59,76,202,0.12)', border: '1px solid rgba(59,76,202,0.1)' }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>Criar conta</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Crie sua conta e comece a montar seus baralhos
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Nome" value={name}
              onChange={e => setName(e.target.value)}
              required autoFocus sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth label="Email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth label="Senha" type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              required helperText="Mínimo 6 caracteres"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit" variant="contained" fullWidth size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Já tem conta?{' '}
            <Link component={NextLink} href="/login" fontWeight={600} color="primary.main" underline="hover">
              Entrar
            </Link>
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
