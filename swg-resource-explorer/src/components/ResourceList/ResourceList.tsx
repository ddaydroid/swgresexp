  import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Pagination, Alert, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResources, fetchResourceById } from '../../redux/slices/resourcesSlice';
import { setPage } from '../../redux/slices/filtersSlice';
import { RootState } from '../../redux/store';
import { AppDispatch } from '../../redux/store';
import ResourceTable from './ResourceTable';
import { Resource } from '../../types/Resource';

/**
 * Resource list component for displaying a list of resources
 */
const ResourceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resources, loading, error, totalResources } = useSelector(
    (state: RootState) => state.resources
  );
  const filters = useSelector((state: RootState) => state.filters);

  // Fetch resources when filters change
  useEffect(() => {
    dispatch(fetchResources(filters));
  }, [dispatch, filters]);

  // Handle resource click
  const handleResourceClick = (resource: Resource) => {
    dispatch(fetchResourceById(resource.id));
  };

  // Handle page change
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResources / filters.limit);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with resource count */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">
          Resources {totalResources > 0 ? `(${totalResources})` : ''}
        </Typography>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Resource list */}
      {!loading && resources.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No resources found matching your filters.
        </Alert>
      )}

      {!loading && resources.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <ResourceTable
              resources={resources}
              onResourceClick={handleResourceClick}
            />
          </Paper>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ResourceList;
