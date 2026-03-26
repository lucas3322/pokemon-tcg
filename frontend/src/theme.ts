'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B4CCA',
      light: '#6B7BE8',
      dark: '#2336A8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#1a1a1a',
    },
    background: {
      default: '#F0F4FF',
      paper: '#FFFFFF',
    },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#10B981' },
    info: { main: '#3B82F6' },
    text: {
      primary: '#1E2A4A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: 'rgba(59, 76, 202, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(59,76,202,0.06), 0 1px 2px rgba(59,76,202,0.04)',
    '0 2px 6px rgba(59,76,202,0.08), 0 1px 3px rgba(59,76,202,0.05)',
    '0 4px 12px rgba(59,76,202,0.10), 0 2px 4px rgba(59,76,202,0.06)',
    '0 6px 16px rgba(59,76,202,0.12)',
    '0 8px 24px rgba(59,76,202,0.12)',
    '0 10px 28px rgba(59,76,202,0.13)',
    '0 12px 32px rgba(59,76,202,0.14)',
    '0 14px 36px rgba(59,76,202,0.14)',
    '0 16px 40px rgba(59,76,202,0.15)',
    '0 18px 44px rgba(59,76,202,0.15)',
    '0 20px 48px rgba(59,76,202,0.16)',
    '0 22px 52px rgba(59,76,202,0.16)',
    '0 24px 56px rgba(59,76,202,0.17)',
    '0 26px 60px rgba(59,76,202,0.17)',
    '0 28px 64px rgba(59,76,202,0.18)',
    '0 30px 68px rgba(59,76,202,0.18)',
    '0 32px 72px rgba(59,76,202,0.19)',
    '0 34px 76px rgba(59,76,202,0.19)',
    '0 36px 80px rgba(59,76,202,0.20)',
    '0 38px 84px rgba(59,76,202,0.20)',
    '0 40px 88px rgba(59,76,202,0.21)',
    '0 42px 92px rgba(59,76,202,0.21)',
    '0 44px 96px rgba(59,76,202,0.22)',
    '0 46px 100px rgba(59,76,202,0.22)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(59,76,202,0.08)',
          border: '1px solid rgba(59,76,202,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(59,76,202,0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '2px 0 16px rgba(59,76,202,0.08)',
          border: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
        contained: {
          boxShadow: '0 3px 10px rgba(59,76,202,0.25)',
          '&:hover': { boxShadow: '0 5px 16px rgba(59,76,202,0.35)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(59,76,202,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(59,76,202,0.4)' },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 8px rgba(59,76,202,0.1)',
          borderBottom: '1px solid rgba(59,76,202,0.08)',
        },
      },
    },
  },
});

export default theme;
