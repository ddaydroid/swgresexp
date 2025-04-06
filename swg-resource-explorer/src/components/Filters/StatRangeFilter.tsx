import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
 * Stat range filter component for filtering resources by stat values using sliders
 */
const StatRangeFilter: React.FC = () => {
  const dispatch = useDispatch();
  const statFilters = useSelector((state: RootState) => state.filters.stats || {});
  
  // Local state for the range values of each stat
  const [ranges, setRanges] = useState<Record<string, [number, number]>>({});

  // Initialize ranges from existing filters
  useEffect(() => {
    const initialRanges: Record<string, [number, number]> = {};
    
    Object.keys(statDefinitions).forEach(stat => {
      if (statFilters[stat]) {
        initialRanges[stat] = [
          statFilters[stat].min ?? 0,
          statFilters[stat].max ?? 1000
        ];
      } else {
        initialRanges[stat] = [0, 1000];
      }
    });
    
    setRanges(initialRanges);
  }, [statFilters]);

  // Handle range change for a specific stat
  const handleRangeChange = (stat: string) => (_event: Event, newValue: number | number[]) => {
    const newRanges = { ...ranges };
    newRanges[stat] = newValue as [number, number];
    setRanges(newRanges);
    
    // Apply filter immediately
    dispatch(
      setStatFilter({
        stat,
        range: {
          min: newRanges[stat][0],
          max: newRanges[stat][1],
        },
      })
    );
  };

  // Clear the filter for a specific stat
  const handleClearFilter = (stat: string) => () => {
    dispatch(clearStatFilter(stat));
    
    const newRanges = { ...ranges };
    newRanges[stat] = [0, 1000];
    setRanges(newRanges);
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
        Resource Stats
      </Typography>
      
      {Object.entries(statDefinitions).map(([stat, { label, name, color }]) => (
        <Accordion key={stat} disableGutters elevation={0} sx={{ mb: 1 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              minHeight: 48,
              '&.Mui-expanded': { minHeight: 48 },
              '& .MuiAccordionSummary-content': { 
                my: 0,
                '&.Mui-expanded': { my: 0 } 
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'medium' }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                {name}
              </Typography>
              
              {statFilters[stat] && (
                <Box 
                  sx={{ 
                    ml: 1, 
                    px: 1, 
                    py: 0.25, 
                    borderRadius: 1, 
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: color,
                    fontSize: '0.75rem',
                  }}
                >
                  {statFilters[stat].min ?? 0} - {statFilters[stat].max ?? 1000}
                </Box>
              )}
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ pt: 0 }}>
            <Box sx={{ px: 1, pt: 1 }}>
              <Slider
                value={ranges[stat] || [0, 1000]}
                onChange={handleRangeChange(stat)}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{ color }}
                marks={[
                  { value: 0, label: '0' },
                  { value: 1000, label: '1000' }
                ]}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Current: {ranges[stat]?.[0] || 0} - {ranges[stat]?.[1] || 1000}
                </Typography>
                
                {statFilters[stat] && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'error.main', 
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={handleClearFilter(stat)}
                  >
                    Clear
                  </Typography>
                )}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default StatRangeFilter;
