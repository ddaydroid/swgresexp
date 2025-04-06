import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Tooltip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setSortBy, 
  setSortDirection, 
  addStatToAverage, 
  removeStatFromAverage,
  clearSortStats 
} from '../../redux/slices/filtersSlice';
import { RootState } from '../../redux/store';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Resource } from '../../types/Resource';

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

// Reverse mapping from full planet names to codes
const planetCodeMap: Record<string, string> = Object.entries(planetMap).reduce(
  (acc, [code, name]) => {
    acc[name] = code;
    return acc;
  },
  {} as Record<string, string>
);

// Stat definitions with labels and descriptions
const statDefinitions = {
  dr: { label: 'DR', name: 'Damage Resistance' },
  ma: { label: 'MA', name: 'Malleability' },
  oq: { label: 'OQ', name: 'Overall Quality' },
  sr: { label: 'SR', name: 'Shock Resistance' },
  ut: { label: 'UT', name: 'Unit Toughness' },
  fl: { label: 'FL', name: 'Flavor' },
  pe: { label: 'PE', name: 'Potential Energy' },
};

interface ResourceTableProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

// Calculate average of selected stats for a resource
const calculateAverage = (resource: Resource, stats: string[]): number => {
  if (!stats || stats.length === 0) return 0;
  
  let sum = 0;
  let count = 0;
  
  stats.forEach(stat => {
    if (resource.stats[stat] !== undefined) {
      sum += resource.stats[stat]!;
      count++;
    }
  });
  
  return count > 0 ? sum / count : 0;
};

const getStatColor = (value: number): string => {
  const percentage = (value / 1000) * 100;
  if (percentage >= 80) return '#2e7d32'; // Dark green text
  if (percentage >= 50) return '#ed6c02'; // Orange text
  return '#d32f2f'; // Red text
};

const ResourceTable: React.FC<ResourceTableProps> = ({ resources, onResourceClick }) => {
  const dispatch = useDispatch();
  const { sortBy, sortDirection, sortStats } = useSelector((state: RootState) => state.filters);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentStat, setCurrentStat] = useState<string | null>(null);
  
  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };
  
  // Handle stat header click for sorting
  const handleStatHeaderClick = (stat: string) => {
    if (sortBy === stat) {
      // Toggle direction if already sorting by this stat
      dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new sort stat and default to descending
      dispatch(setSortBy(stat));
      dispatch(setSortDirection('desc'));
    }
  };
  
  // Handle opening the stat menu
  const handleStatMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, stat: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentStat(stat);
  };
  
  // Handle closing the stat menu
  const handleStatMenuClose = () => {
    setAnchorEl(null);
    setCurrentStat(null);
  };
  
  // Handle adding/removing a stat to/from the average calculation
  const handleToggleStatInAverage = (stat: string) => {
    if (sortStats?.includes(stat)) {
      dispatch(removeStatFromAverage(stat));
    } else {
      dispatch(addStatToAverage(stat));
    }
  };
  
  // Sort resources based on current sort settings
  const sortedResources = [...resources].sort((a, b) => {
    if (sortBy === 'average' && sortStats && sortStats.length > 0) {
      const avgA = calculateAverage(a, sortStats);
      const avgB = calculateAverage(b, sortStats);
      return sortDirection === 'asc' ? avgA - avgB : avgB - avgA;
    } else if (sortBy && Object.keys(statDefinitions).includes(sortBy)) {
      const valA = a.stats[sortBy] || 0;
      const valB = b.stats[sortBy] || 0;
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5, width: '20%' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5, width: '15%' }}>Planets</TableCell>
              {Object.entries(statDefinitions).map(([stat, { label, name }]) => (
                <TableCell 
                  key={label} 
                  align="center"
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 1.5, 
                    width: '8%',
                    cursor: 'pointer',
                    backgroundColor: sortStats?.includes(stat) ? 'rgba(187, 134, 252, 0.1)' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                  onClick={() => handleStatHeaderClick(stat)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tooltip title={`Sort by ${name}`} arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {label}
                        {sortBy === stat && (
                          sortDirection === 'asc' ? 
                            <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                            <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                        )}
                      </Box>
                    </Tooltip>
                    <Tooltip title="Stat options" arrow>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleStatMenuOpen(e, stat)}
                        sx={{ ml: 0.5 }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              ))}
              
              {/* Average column when using average sort */}
              {sortBy === 'average' && sortStats && sortStats.length > 0 && (
                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 'bold', 
                    py: 1.5, 
                    width: '8%',
                    backgroundColor: 'rgba(187, 134, 252, 0.1)',
                  }}
                >
                  <Tooltip 
                    title={`Average of ${sortStats.map(s => statDefinitions[s as keyof typeof statDefinitions].name).join(', ')}`} 
                    arrow
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Avg
                      {sortDirection === 'asc' ? 
                        <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} /> : 
                        <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                      }
                    </Box>
                  </Tooltip>
                </TableCell>
              )}
            <TableCell sx={{ fontWeight: 'bold', py: 1.5, width: '15%' }}>Available Since</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedResources.map((resource) => (
            <TableRow
              key={resource.id}
              hover
              onClick={() => onResourceClick(resource)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {resource.name}
                  <Typography variant="caption" color="text.secondary">
                    {resource.type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {resource.planets.map((planet) => (
                    <Tooltip key={planet} title={planet} arrow>
                      <Chip
                        label={planetCodeMap[planet] || planet}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </TableCell>
              {Object.keys(statDefinitions).map((stat) => (
                <TableCell 
                  key={stat}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    py: 1,
                    fontSize: '0.9rem',
                    width: '80px',
                    color: resource.stats[stat] ? getStatColor(resource.stats[stat]!) : 'text.secondary',
                    backgroundColor: sortStats?.includes(stat) ? 'rgba(187, 134, 252, 0.05)' : 'inherit',
                  }}
                >
                  {resource.stats[stat] || '—'}
                </TableCell>
              ))}
              
              {/* Average value cell */}
              {sortBy === 'average' && sortStats && sortStats.length > 0 && (
                <TableCell 
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    py: 1,
                    fontSize: '0.9rem',
                    width: '80px',
                    backgroundColor: 'rgba(187, 134, 252, 0.05)',
                    color: getStatColor(calculateAverage(resource, sortStats))
                  }}
                >
                  {Math.round(calculateAverage(resource, sortStats))}
                </TableCell>
              )}
              <TableCell sx={{ py: 1 }}>{formatDate(resource.availableTimestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Stat options menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatMenuClose}
      >
        <MenuItem onClick={() => {
          if (currentStat) {
            handleStatHeaderClick(currentStat);
          }
          handleStatMenuClose();
        }}>
          Sort {sortDirection === 'desc' ? 'Ascending' : 'Descending'}
        </MenuItem>
        <MenuItem onClick={() => {
          if (currentStat) {
            handleToggleStatInAverage(currentStat);
          }
          handleStatMenuClose();
        }}>
          <Checkbox 
            checked={currentStat ? sortStats?.includes(currentStat) : false} 
            size="small"
          />
          <ListItemText>Include in Average</ListItemText>
        </MenuItem>
        {sortBy === 'average' && (
          <MenuItem onClick={() => {
            dispatch(clearSortStats());
            handleStatMenuClose();
          }}>
            Clear Average Selection
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
};

export default ResourceTable;
