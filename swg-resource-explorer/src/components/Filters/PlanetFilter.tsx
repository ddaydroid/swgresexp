import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPlanetFilter } from '../../redux/slices/filtersSlice';
import { RootState } from '../../redux/store';

// Planet codes and their full names
const planetMap: Record<string, string> = {
  'CO': 'Corellia',
  'DA': 'Dantooine',
  'DM': 'Dathomir',
  'EN': 'Endor',
  'KY': 'Kashyyyk',
  'LK': 'Lok',
  'MF': 'Mustafar',
  'NB': 'Naboo',
  'RO': 'Rori',
  'TL': 'Talus',
  'TT': 'Tatooine',
  'YV': 'Yavin 4',
};

// List of planet codes
const planets = Object.keys(planetMap);

/**
 * Planet filter component for filtering resources by planet
 */
const PlanetFilter: React.FC = () => {
  const dispatch = useDispatch();
  const planetFilter = useSelector((state: RootState) => state.filters.planet);
  const [selectedPlanet, setSelectedPlanet] = useState(planetFilter || '');

  // Update local state when the filter changes in Redux
  useEffect(() => {
    setSelectedPlanet(planetFilter || '');
  }, [planetFilter]);

  // Handle planet selection change
  const handlePlanetChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedPlanet(value);
    dispatch(setPlanetFilter(value));
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
        Planet
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
        <InputLabel id="planet-select-label">Select Planet</InputLabel>
        <Select
          labelId="planet-select-label"
          id="planet-select"
          value={selectedPlanet}
          label="Select Planet"
          onChange={handlePlanetChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>All Planets</em>
          </MenuItem>
          {planets.map((planetCode) => (
            <MenuItem key={planetCode} value={planetCode}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>{planetMap[planetCode]}</Typography>
                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({planetCode})
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default PlanetFilter;
