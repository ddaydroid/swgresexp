import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Resource } from '../../types/Resource';

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

interface StatTableProps {
  resource: Resource;
}

/**
 * Stat table component for displaying resource stats in a table
 */
const StatTable: React.FC<StatTableProps> = ({ resource }) => {
  // Get color based on stat value
  const getStatColor = (value: number): string => {
    const percentage = (value / 1000) * 100;
    if (percentage >= 80) return '#2e7d32'; // Dark green text
    if (percentage >= 50) return '#ed6c02'; // Orange text
    return '#d32f2f'; // Red text
  };

  // Get stats that exist in the resource
  const resourceStats = Object.entries(resource.stats).filter(([_, value]) => value !== undefined);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Stat</TableCell>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Name</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', py: 1.5 }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resourceStats.map(([stat, value]) => (
            <TableRow key={stat}>
              <TableCell sx={{ py: 1, fontWeight: 'bold' }}>
                {statDefinitions[stat as keyof typeof statDefinitions]?.label || stat}
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                {statDefinitions[stat as keyof typeof statDefinitions]?.name || stat}
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  py: 1, 
                  fontWeight: 'bold',
                  color: value ? getStatColor(value) : 'text.secondary',
                  fontSize: '0.9rem'
                }}
              >
                {value || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StatTable;
