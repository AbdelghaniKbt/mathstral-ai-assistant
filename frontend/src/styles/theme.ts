import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Blue color for primary actions
    },
    background: {
      default: '#111111', // Very dark gray for main background
      paper: '#1e1e1e', // Slightly lighter gray for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;