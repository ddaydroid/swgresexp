import React from 'react';
import { Box, Typography, Link } from '@mui/material';

/**
 * Footer component for the application
 */
const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {'SWG Resource Explorer © '}
        {new Date().getFullYear()}
        {' | Data from '}
        <Link color="primary" href="https://swgaide.com/" target="_blank" rel="noopener">
          SWGAide
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
