import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#1877F2',
            light: '#4267B2',
            dark: '#365899',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#42B72A',
            light: '#5AC045',
            dark: '#36A420',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#F0F2F5',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#050505',
            secondary: '#65676B',
          },
        }
      : {
          primary: {
            main: '#1877F2',
            light: '#4267B2',
            dark: '#365899',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#42B72A',
            light: '#5AC045',
            dark: '#36A420',
            contrastText: '#FFFFFF',
          },
          background: {
            default: '#18191A',
            paper: '#242526',
          },
          text: {
            primary: '#E4E6EB',
            secondary: '#B0B3B8',
          },
        }),
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [maxNewTokens, setMaxNewTokens] = useState(512);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [topK, setTopK] = useState(50);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage toggleMode={toggleMode} mode={mode} />} />
          <Route
            path="/chat"
            element={
              <ChatPage
                maxNewTokens={maxNewTokens}
                temperature={temperature}
                topP={topP}
                topK={topK}
                setMaxNewTokens={setMaxNewTokens}
                setTemperature={setTemperature}
                setTopP={setTopP}
                setTopK={setTopK}
                mode={mode}
                toggleMode={toggleMode}
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;