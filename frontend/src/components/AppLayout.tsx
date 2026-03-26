'use client';
import { useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, IconButton, useTheme, useMediaQuery, AppBar, Toolbar, Chip,
  Avatar, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StyleIcon from '@mui/icons-material/Style';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MenuIcon from '@mui/icons-material/Menu';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Buscar Cartas', href: '/', icon: <SearchIcon /> },
  { label: 'Meus Baralhos', href: '/decks', icon: <StyleIcon /> },
  { label: 'Rotação', href: '/rotation', icon: <AutorenewIcon /> },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #3B4CCA 0%, #5B6FE8 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CatchingPokemonIcon sx={{ fontSize: 32, color: '#FFDE00' }} />
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.1 }}>
              Pokemon TCG
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              Manager
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(59,76,202,0.1)' }} />
      <List sx={{ pt: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { router.push(item.href); if (isMobile) setMobileOpen(false); }}
                sx={{
                  mx: 1.5,
                  borderRadius: 2,
                  ...(isActive && {
                    bgcolor: 'rgba(59,76,202,0.08)',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 700 },
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(59,76,202,0.1)' }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 15, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
          </Box>
          <Tooltip title="Sair">
            <IconButton size="small" onClick={logout} color="error" sx={{ flexShrink: 0 }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Chip label="Powered by PokemonTCG.io" size="small" sx={{ fontSize: '0.65rem', opacity: 0.45, width: '100%' }} />
      </Box>
    </Box>
  );

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {isMobile && (
          <AppBar position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
            <Toolbar>
              <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <CatchingPokemonIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={800} color="primary.main">Pokemon TCG</Typography>
            </Toolbar>
          </AppBar>
        )}

        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: isMobile ? 8 : 0,
            minHeight: '100vh',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
