import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Snackbar, LinearProgress, CircularProgress, Fade, Zoom } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { initializeModel } from '../services/api';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const FloatingIcon = styled(RocketLaunchIcon)(({ theme }) => ({
  fontSize: '100px',
  color: theme.palette.primary.main,
  animation: `${float} 3s ease-in-out infinite`,
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  border: 0,
  borderRadius: 30,
  color: 'white',
  padding: '10px 30px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

interface HomePageProps {
  toggleMode: () => void;
  mode: 'light' | 'dark';
}

const HomePage: React.FC<HomePageProps> = ({ toggleMode, mode }) => {
  const [hfToken, setHfToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const handleInitialize = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setStatus('Initializing Mathstral model with Llama.cpp...');

    try {
      await initializeModel(
        hfToken, 
        (progress: number, status: string) => {
          setProgress(progress);
          setStatus(status);
        }
      );
      setStatus('Mathstral model initialized successfully!');
      setTimeout(() => navigate('/chat'), 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 20, 
          right: 20,
          zIndex: 1,
        }}
      >
        <Button
          onClick={toggleMode}
          startIcon={mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Box>

      <Zoom in={showContent} style={{ transitionDelay: showContent ? '500ms' : '0ms' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <FloatingIcon />
          <GradientText variant="h2" gutterBottom>
            Mathstral AI Assistant
          </GradientText>
          <Typography variant="h5" gutterBottom>
            Powered by Llama.cpp
          </Typography>
        </Box>
      </Zoom>

      <Fade in={showContent} style={{ transitionDelay: showContent ? '1000ms' : '0ms' }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Hugging Face Token"
            type="password"
            value={hfToken}
            onChange={(e) => setHfToken(e.target.value)}
            variant="outlined"
          />

          <StyledButton
            fullWidth
            onClick={handleInitialize}
            disabled={isLoading || !hfToken}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Initializing...' : 'Launch Mathstral AI'}
          </StyledButton>

          {isLoading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" align="center" gutterBottom>
                {status}
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            </Box>
          )}
        </Box>
      </Fade>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;