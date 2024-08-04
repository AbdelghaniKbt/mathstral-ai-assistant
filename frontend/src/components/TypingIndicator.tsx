import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const TypingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
      <CircularProgress size={20} />
    </Box>
  );
};

export default TypingIndicator;
