import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
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
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Filter panel */}
            <Box sx={{ width: { xs: '100%', md: '25%' } }}>
              <FilterPanel />
            </Box>
            
            {/* Main content */}
            <Box sx={{ width: { xs: '100%', md: '75%' } }}>
              <Box sx={{ mb: 3 }}>
                <ResourceDetail />
              </Box>
              <ResourceList />
            </Box>
          </Box>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
