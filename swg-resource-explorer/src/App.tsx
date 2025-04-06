import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Provider } from 'react-redux';
import store from './redux/store';
import theme from './theme/theme';
import Layout from './components/Layout/Layout';
import FilterPanel from './components/Filters/FilterPanel';
import ResourceList from './components/ResourceList/ResourceList';
import ResourceDetail from './components/ResourceDetail/ResourceDetail';

/**
 * Main App component
 */
const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            position: 'relative',
            width: '100%'
          }}>
            {/* Main content */}
            <Box sx={{ 
              width: '100%', 
              transition: 'all 0.3s ease',
              px: 2,
              ml: 0,
              mr: { xs: 0, md: isSidebarOpen ? '250px' : '50px' }
            }}>
              <Box sx={{ mb: 3 }}>
                <ResourceDetail />
              </Box>
              <ResourceList />
            </Box>
            
            {/* Collapsible sidebar */}
            <Box 
              sx={{ 
                position: 'fixed',
                right: 0,
                top: 64, // Height of the AppBar
                bottom: 0,
                width: { xs: '100%', md: isSidebarOpen ? '250px' : '50px' },
                height: { xs: 'auto', md: 'calc(100% - 64px)' },
                transition: 'width 0.3s ease',
                zIndex: 10,
                bgcolor: 'background.paper',
                boxShadow: 2,
                display: { xs: isSidebarOpen ? 'block' : 'none', md: 'block' },
                overflowY: 'auto'
              }}
            >
              <IconButton 
                onClick={toggleSidebar}
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  left: 10, 
                  zIndex: 11,
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                {isSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
              
              {isSidebarOpen && (
                <Box sx={{ p: 2, pt: { xs: 2, md: 6 } }}>
                  <FilterPanel />
                </Box>
              )}
            </Box>
          </Box>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
