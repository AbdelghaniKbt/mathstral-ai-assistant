import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Avatar, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Message } from '../types/chat';

interface ChatBoxProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ onSendMessage, messages }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await onSendMessage(input);
    setInput('');
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'background.paper' }}>
        {messages.map((message, index) => (
          <Fade key={index} in={true} timeout={500}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                {!message.isUser && (
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>AI</Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: message.isUser ? 'primary.light' : (message.isError ? 'error.light' : 'background.default'),
                    color: message.isUser ? 'primary.contrastText' : (message.isError ? 'error.contrastText' : 'text.primary'),
                    borderRadius: 2,
                    maxWidth: '70%',
                  }}
                >
                  <Typography variant="body1">
                    {message.text}
                  </Typography>
                </Paper>
                {message.isUser && (
                  <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>U</Avatar>
                )}
              </Box>
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" color="primary" sx={{ p: '10px' }}>
                <SendIcon />
              </IconButton>
            ),
            sx: {
              borderRadius: 4,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default ChatBox;