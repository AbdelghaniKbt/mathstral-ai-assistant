import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Fade, Zoom, Chip, Drawer } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FunctionsIcon from '@mui/icons-material/Functions';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled, keyframes } from '@mui/material/styles';
import { Message } from '../types/chat';
import { generateResponse } from '../services/api';
import ParametersSidebar from '../components/ParametersSidebar';

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const FloatingIcon = styled(FunctionsIcon)(({ theme }) => ({
  fontSize: '60px',
  color: theme.palette.primary.main,
  animation: `${float} 6s ease-in-out infinite`,
  position: 'absolute',
  top: '20px',
  left: '20px',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const mathExamples = [
  "Calculate the derivative of f(x) = x^3 - 2x + 1",
  "Solve the equation: 2x^2 + 5x - 3 = 0",
  "Find the area under the curve y = x^2 from x = 0 to x = 2",
  "Determine the limit of (sin(x) / x) as x approaches 0",
  "Calculate the eigenvalues of the matrix [[3, 1], [1, 3]]",
];

interface ChatPageProps {
  maxNewTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  setMaxNewTokens: (value: number) => void;
  setTemperature: (value: number) => void;
  setTopP: (value: number) => void;
  setTopK: (value: number) => void;
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
  maxNewTokens,
  temperature,
  topP,
  topK,
  setMaxNewTokens,
  setTemperature,
  setTopP,
  setTopK,
  mode,
  toggleMode
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { text: messageText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await generateResponse(
        messageText,
        { maxNewTokens, temperature, topP, topK },
        {
          onUpdate: (partialResponse) => {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (!lastMessage.isUser) {
                return [...prev.slice(0, -1), { text: partialResponse, isUser: false }];
              } else {
                return [...prev, { text: partialResponse, isUser: false }];
              }
            });
          },
          onFinish: () => {
            setIsLoading(false);
          },
          onError: (error) => {
            setMessages(prev => [
              ...prev,
              { text: `Error: ${error}`, isUser: false, isError: true }
            ]);
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [
        ...prev,
        { text: 'An unexpected error occurred. Please try again.', isUser: false, isError: true }
      ]);
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FloatingIcon />
      <Box sx={{ p: 2, textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={toggleMode} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <GradientText variant="h4" gutterBottom>
          Mathstral AI Chat
        </GradientText>
        <IconButton onClick={toggleSidebar} color="primary">
          <SettingsIcon />
        </IconButton>
      </Box>

      {messages.length === 0 && (
        <Zoom in={true} style={{ transitionDelay: '500ms' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 4 }}>
            {mathExamples.map((example, index) => (
              <Chip
                key={index}
                label={example}
                onClick={() => handleSendMessage(example)}
                sx={{
                  fontSize: '1rem',
                  py: 2,
                  px: 1,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                }}
              />
            ))}
          </Box>
        </Zoom>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message, index) => (
          <Fade key={index} in={true} timeout={500}>
            <StyledPaper elevation={3} sx={{
              maxWidth: '70%',
              ml: message.isUser ? 'auto' : 0,
              mr: message.isUser ? 0 : 'auto',
              bgcolor: message.isUser ? 'primary.light' : 'background.paper',
              color: message.isUser ? 'primary.contrastText' : 'text.primary',
            }}>
              <Typography variant="body1">
                {message.text}
              </Typography>
            </StyledPaper>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </Box>

    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} sx={{ p: 2, bgcolor: 'background.paper' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a math question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" disabled={isLoading}>
                <SendIcon />
              </IconButton>
            ),
            sx: {
              borderRadius: '30px',
              bgcolor: 'background.default',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
      >
        <ParametersSidebar
          maxNewTokens={maxNewTokens}
          setMaxNewTokens={setMaxNewTokens}
          temperature={temperature}
          setTemperature={setTemperature}
          topP={topP}
          setTopP={setTopP}
          topK={topK}
          setTopK={setTopK}
        />
      </Drawer>
    </Box>
  );
};

export default ChatPage;
