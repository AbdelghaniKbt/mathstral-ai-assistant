import React from 'react';
import { Box, Typography, Slider, TextField } from '@mui/material';

interface ParametersSidebarProps {
  maxNewTokens: number;
  setMaxNewTokens: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  topK: number;
  setTopK: (value: number) => void;
}

const ParametersSidebar: React.FC<ParametersSidebarProps> = ({
  maxNewTokens,
  setMaxNewTokens,
  temperature,
  setTemperature,
  topP,
  setTopP,
  topK,
  setTopK,
}) => {
  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Typography variant="h6" gutterBottom>Parameters</Typography>
      
      <Typography gutterBottom>Max New Tokens</Typography>
      <Slider
        value={maxNewTokens}
        onChange={(_, value) => setMaxNewTokens(value as number)}
        min={1}
        max={2048}
        valueLabelDisplay="auto"
      />
      <TextField
        value={maxNewTokens}
        onChange={(e) => setMaxNewTokens(Number(e.target.value))}
        type="number"
        size="small"
        fullWidth
        margin="normal"
      />

      <Typography gutterBottom>Temperature</Typography>
      <Slider
        value={temperature}
        onChange={(_, value) => setTemperature(value as number)}
        min={0}
        max={1}
        step={0.01}
        valueLabelDisplay="auto"
      />
      <TextField
        value={temperature}
        onChange={(e) => setTemperature(Number(e.target.value))}
        type="number"
        size="small"
        fullWidth
        margin="normal"
      />

      <Typography gutterBottom>Top P</Typography>
      <Slider
        value={topP}
        onChange={(_, value) => setTopP(value as number)}
        min={0}
        max={1}
        step={0.01}
        valueLabelDisplay="auto"
      />
      <TextField
        value={topP}
        onChange={(e) => setTopP(Number(e.target.value))}
        type="number"
        size="small"
        fullWidth
        margin="normal"
      />

      <Typography gutterBottom>Top K</Typography>
      <Slider
        value={topK}
        onChange={(_, value) => setTopK(value as number)}
        min={1}
        max={100}
        valueLabelDisplay="auto"
      />
      <TextField
        value={topK}
        onChange={(e) => setTopK(Number(e.target.value))}
        type="number"
        size="small"
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

export default ParametersSidebar;