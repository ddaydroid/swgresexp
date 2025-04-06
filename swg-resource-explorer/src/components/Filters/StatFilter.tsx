import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Slider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setStatFilter, clearStatFilter } from '../../redux/slices/filtersSlice';
import { RootState } from '../../redux/store';

// Stat definitions with labels and descriptions
const statDefinitions = {
  dr: { label: 'DR', name: 'Damage Resistance', color: '#f44336' },
  ma: { label: 'MA', name: 'Malleability', color: '#2196f3' },
  oq: { label: 'OQ', name: 'Overall Quality', color: '#4caf50' },
  sr: { label: 'SR', name: 'Shock Resistance', color: '#ff9800' },
  ut: { label: 'UT', name: 'Unit Toughness', color: '#9c27b0' },
  fl: { label: 'FL', name: 'Flavor', color: '#e91e63' },
  pe: { label: 'PE', name: 'Potential Energy', color: '#00bcd4' },
};

/**
 * Stat filter component for filtering resources by stat values
 */
const StatFilter: React.FC = () => {
  const dispatch = useDispatch();
  const statFilters = useSelector((state: RootState) => state.filters.stats || {});
  
  // Local state for the selected stat and range
  const [selectedStat, setSelectedStat] = useState<string>('');
  const [range, setRange] = useState<[number, number]>([0, 1000]);

  // Handle stat selection change
  const handleStatChange = (event: SelectChangeEvent<string>) => {
    const stat = event.target.value;
    setSelectedStat(stat);
    
    // Reset range when changing stat
    if (statFilters[stat]) {
      const min = statFilters[stat].min ?? 0;
      const max = statFilters[stat].max ?? 1000;
      setRange([min, max]);
    } else {
      setRange([0, 1000]);
    }
  };

  // Handle range change
  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    setRange(newValue as [number, number]);
  };

  // Apply the filter
  const applyFilter = () => {
    if (selectedStat) {
      dispatch(
        setStatFilter({
          stat: selectedStat,
          range: {
            min: range[0],
            max: range[1],
          },
        })
      );
    }
  };

  // Clear the filter
  const clearFilter = () => {
    if (selectedStat) {
      dispatch(clearStatFilter(selectedStat));
      setRange([0, 1000]);
    }
  };

  // Update range when filter changes in Redux
  useEffect(() => {
    if (selectedStat && statFilters[selectedStat]) {
      const min = statFilters[selectedStat].min ?? 0;
      const max = statFilters[selectedStat].max ?? 1000;
      setRange([min, max]);
    }
  }, [selectedStat, statFilters]);

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
        Stat Filter
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="stat-select-label">Select Stat</InputLabel>
            <Select
              labelId="stat-select-label"
              id="stat-select"
              value={selectedStat}
              label="Select Stat"
              onChange={handleStatChange}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select a stat</em>
              </MenuItem>
              {Object.entries(statDefinitions).map(([key, { label, name }]) => (
                <MenuItem key={key} value={key}>
                  {label} - {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {selectedStat && (
          <>
            <Box sx={{ px: 1 }}>
              <Typography variant="body2" gutterBottom>
                Range: {range[0]} - {range[1]}
              </Typography>
              <Slider
                value={range}
                onChange={handleRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{
                  color: selectedStat ? statDefinitions[selectedStat as keyof typeof statDefinitions]?.color : 'primary.main',
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={applyFilter}
                fullWidth
                size="small"
              >
                Apply
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={clearFilter}
                fullWidth
                size="small"
              >
                Clear
              </Button>
            </Box>
          </>
        )}
      </Box>
      
      {/* Active filters display */}
      {Object.keys(statFilters).length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(statFilters).map(([stat, { min, max }]) => (
              <Box
                key={stat}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  border: 1,
                  borderColor: statDefinitions[stat as keyof typeof statDefinitions]?.color,
                }}
              >
                <Typography variant="caption" sx={{ mr: 0.5 }}>
                  {statDefinitions[stat as keyof typeof statDefinitions]?.label}:
                </Typography>
                <Typography variant="caption">
                  {min ?? 0} - {max ?? 1000}
                </Typography>
                <Button
                  size="small"
                  sx={{ minWidth: 'auto', ml: 0.5, p: 0 }}
                  onClick={() => dispatch(clearStatFilter(stat))}
                >
                  ×
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default StatFilter;
