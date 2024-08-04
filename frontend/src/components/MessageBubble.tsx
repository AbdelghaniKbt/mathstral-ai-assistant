import React from 'react';
import { Box, Typography, Paper, Grow } from '@mui/material';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  return (
    <Grow in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 1,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            bgcolor: isUser ? 'primary.main' : 'grey.200',
            color: isUser ? 'white' : 'text.primary',
            maxWidth: '70%',
            borderRadius: isUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
          }}
        >
          <Typography variant="body1">
            {message}
          </Typography>
        </Paper>
      </Box>
    </Grow>
  );
};

export default MessageBubble;
