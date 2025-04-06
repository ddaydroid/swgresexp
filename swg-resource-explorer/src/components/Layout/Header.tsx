import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

/**
 * Header component for the application
 */
const Header: React.FC = () => {
  return (
    <AppBar position="static" elevation={4}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
          SWG Resource Explorer
        </Typography>
        <Button color="primary" variant="outlined" size="small">
          Dark Mode
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
