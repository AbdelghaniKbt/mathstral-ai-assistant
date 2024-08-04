import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, Switch } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Sidebar from './Sidebar';
import ParametersSidebar from './ParametersSidebar';

interface LayoutProps {
  children: React.ReactNode;
  onNewChat: () => void;
  chatHistory: string[];
  maxNewTokens: number;
  setMaxNewTokens: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  topK: number;
  setTopK: (value: number) => void;
  mode: 'light' | 'dark';
  toggleMode: () => void;
  showSidebars: boolean;
}

const drawerWidth = 240;
const rightDrawerWidth = 300;

const Layout: React.FC<LayoutProps> = ({
  children,
  onNewChat,
  chatHistory,
  maxNewTokens,
  setMaxNewTokens,
  temperature,
  setTemperature,
  topP,
  setTopP,
  topK,
  setTopK,
  mode,
  toggleMode,
  showSidebars
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRightDrawerToggle = () => {
    setRightDrawerOpen(!rightDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {showSidebars && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Mathstral AI Assistant
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {showSidebars && (
            <IconButton color="inherit" onClick={handleRightDrawerToggle}>
              <SettingsIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {showSidebars && (
        <>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Sidebar onNewChat={onNewChat} chatHistory={chatHistory} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            <Sidebar onNewChat={onNewChat} chatHistory={chatHistory} />
          </Drawer>
        </>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: showSidebars ? { sm: `calc(100% - ${drawerWidth}px)` } : '100%' }}>
        <Toolbar />
        {children}
      </Box>
      {showSidebars && (
        <Drawer
          anchor="right"
          open={rightDrawerOpen}
          onClose={handleRightDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': { width: rightDrawerWidth },
          }}
        >
          <Toolbar />
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
      )}
    </Box>
  );
};

export default Layout;
