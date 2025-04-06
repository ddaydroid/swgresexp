import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setTypeFilter } from '../../redux/slices/filtersSlice';
import { fetchResourceCategories } from '../../redux/slices/resourcesSlice';
import { RootState } from '../../redux/store';
import { AppDispatch } from '../../redux/store';

/**
 * Resource type filter component for filtering resources by type
 */
const ResourceTypeFilter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const typeFilter = useSelector((state: RootState) => state.filters.type);
  const categories = useSelector((state: RootState) => state.resources.categories);
  const loading = useSelector((state: RootState) => state.resources.loading);
  const [selectedType, setSelectedType] = useState(typeFilter || '');

  // Fetch resource categories on component mount
  useEffect(() => {
    if (!categories) {
      dispatch(fetchResourceCategories());
    }
  }, [categories, dispatch]);

  // Update local state when the filter changes in Redux
  useEffect(() => {
    setSelectedType(typeFilter || '');
  }, [typeFilter]);

  // Handle type selection change
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedType(value);
    dispatch(setTypeFilter(value));
  };

  // Extract all resource types from categories
  const getResourceTypes = () => {
    if (!categories) return [];
    
    const allTypes: string[] = [];
    
    // Add all full types from all categories
    Object.values(categories.categories).forEach(typeArray => {
      typeArray.forEach(type => {
        if (!allTypes.includes(type)) {
          allTypes.push(type);
        }
      });
    });
    
    return allTypes.sort();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        Resource Type
      </Typography>
      <FormControl 
        fullWidth 
        size="small"
        sx={{
          position: 'relative',
          '& .MuiInputLabel-root': {
            backgroundColor: 'background.paper', // Match paper background
            paddingRight: 0.5,
            paddingLeft: 0.5,
            zIndex: 1,
            '&.Mui-focused, &.MuiFormLabel-filled': {
              zIndex: 1 
            }
          },
          '& .MuiSelect-select': {
            zIndex: 0
          }
        }}
      >
        <InputLabel id="type-select-label">Select Type</InputLabel>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Select
            labelId="type-select-label"
            id="type-select"
            value={selectedType}
            label="Select Type"
            onChange={handleTypeChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>All Types</em>
            </MenuItem>
            {getResourceTypes().map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
    </Paper>
  );
};

export default ResourceTypeFilter;
