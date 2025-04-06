import React from 'react';
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

interface ResourceTableProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

const getStatColor = (value: number): string => {
  const percentage = (value / 1000) * 100;
  if (percentage >= 80) return '#2e7d32'; // Dark green text
  if (percentage >= 50) return '#ed6c02'; // Orange text
  return '#d32f2f'; // Red text
};

const ResourceTable: React.FC<ResourceTableProps> = ({ resources, onResourceClick }) => {
  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Planets</TableCell>
            {Object.values(statDefinitions).map(({ label, name }) => (
              <TableCell 
                key={label} 
                title={name}
                align="center"
                sx={{ fontWeight: 'bold', py: 1.5 }}
              >
                {label}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Available Since</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource) => (
            <TableRow
              key={resource.id}
              hover
              onClick={() => onResourceClick(resource)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell sx={{ py: 1 }}>{resource.name}</TableCell>
              <TableCell sx={{ py: 1 }}>{resource.type}</TableCell>
              <TableCell sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {resource.planets.map((planet) => (
                    <Chip
                      key={planet}
                      label={planet}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
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
                    color: resource.stats[stat] ? getStatColor(resource.stats[stat]!) : 'text.secondary'
                  }}
                >
                  {resource.stats[stat] || '—'}
                </TableCell>
              ))}
              <TableCell sx={{ py: 1 }}>{formatDate(resource.availableTimestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResourceTable;
