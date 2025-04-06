import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import SearchBar from '../Filters/SearchBar';

/**
 * Header component for the application
 */
const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={4}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ mr: 2, color: 'primary.main' }}>
          SWG Resource Explorer
        </Typography>
        
        <Box sx={{ flexGrow: 1, maxWidth: 500 }}>
          <SearchBar />
        </Box>
        
        <Button color="primary" variant="outlined" size="small" sx={{ ml: 2 }}>
          Dark Mode
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
