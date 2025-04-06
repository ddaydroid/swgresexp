import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch, useSelector } from 'react-redux';
import { setNameFilter } from '../../redux/slices/filtersSlice';
import { RootState } from '../../redux/store';

/**
 * Search bar component for filtering resources by name
 */
const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const nameFilter = useSelector((state: RootState) => state.filters.name);
  const [searchTerm, setSearchTerm] = useState(nameFilter || '');

  // Update local state when the filter changes in Redux
  useEffect(() => {
    setSearchTerm(nameFilter || '');
  }, [nameFilter]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    dispatch(setNameFilter(searchTerm));
  };

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(setNameFilter(''));
  };

  // Handle key press (Enter)
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0.5,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mb: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search resources by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClearSearch}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Paper>
  );
};

export default SearchBar;
