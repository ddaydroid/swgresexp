import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedResource } from '../../redux/slices/resourcesSlice';
import { RootState } from '../../redux/store';
import StatTable from './StatTable';


/**
 * Resource detail component for displaying detailed information about a selected resource
 */
const ResourceDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedResource, loading } = useSelector(
    (state: RootState) => state.resources
  );

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Handle close button click
  const handleClose = () => {
    dispatch(clearSelectedResource());
  };

  // If no resource is selected, return null
  if (!selectedResource && !loading) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'background.paper',
        position: 'relative',
      }}
    >
      {/* Loading indicator */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Resource details */}
      {!loading && selectedResource && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {selectedResource.name}
            </Typography>
            <Button variant="outlined" size="small" onClick={handleClose}>
              Close
            </Button>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            {selectedResource.type} ({selectedResource.typeId})
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
            {selectedResource.planets.map((planet) => (
              <Chip
                key={planet}
                label={planet}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Stats
          </Typography>

          <Box sx={{ mb: 3 }}>
            <StatTable resource={selectedResource} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Available since: {formatDate(selectedResource.availableTimestamp)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Source: {selectedResource.availableBy}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ResourceDetail;
