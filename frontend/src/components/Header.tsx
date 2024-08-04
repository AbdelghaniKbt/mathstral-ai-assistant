import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 56 }}>
          <Box display="flex" alignItems="center">
            <FunctionsIcon sx={{ fontSize: 32, marginRight: 1, color: 'white' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
              Mathstral AI Assistant
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
