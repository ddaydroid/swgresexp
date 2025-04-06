import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import SearchBar from './SearchBar';
import PlanetFilter from './PlanetFilter';
import ResourceTypeFilter from './ResourceTypeFilter';
import StatFilter from './StatFilter';

/**
 * Filter panel component that combines all filter components
 */
const FilterPanel: React.FC = () => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        height: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SearchBar />
        <PlanetFilter />
        <ResourceTypeFilter />
        <StatFilter />
      </Box>
    </Paper>
  );
};

export default FilterPanel;
