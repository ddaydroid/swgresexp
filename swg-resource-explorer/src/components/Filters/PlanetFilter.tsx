import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPlanetFilter } from '../../redux/slices/filtersSlice';
import { RootState } from '../../redux/store';

// List of planets in SWG
const planets = [
  'Corellia',
  'Dantooine',
  'Dathomir',
  'Endor',
  'Kashyyyk',
  'Lok',
  'Mustafar',
  'Naboo',
  'Rori',
  'Talus',
  'Tatooine',
  'Yavin 4',
];

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
      <FormControl fullWidth size="small">
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
          {planets.map((planet) => (
            <MenuItem key={planet} value={planet}>
              {planet}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default PlanetFilter;
