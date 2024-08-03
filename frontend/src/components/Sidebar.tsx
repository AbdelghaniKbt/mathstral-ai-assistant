import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';

interface SidebarProps {
  onNewChat: () => void;
  chatHistory: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, chatHistory }) => {
  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          width: 250,
          height: '100vh',
          backgroundColor: 'primary.main',
          color: 'white',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateX(5px)',
          },
        }}
      >
        <Button
          startIcon={<AddIcon />}
          fullWidth
          variant="outlined"
          onClick={onNewChat}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            marginBottom: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          New chat
        </Button>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {chatHistory.map((chat, index) => (
            <ListItem
              button
              key={index}
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <ListItemIcon>
                <ChatIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={chat} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Slide>
  );
};

export default Sidebar;