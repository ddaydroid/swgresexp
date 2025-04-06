import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { Resource } from '../../types/Resource';

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

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

/**
 * Resource card component for displaying a resource in the list
 */
const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
      onClick={() => onClick(resource)}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {resource.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {resource.type}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
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
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" gutterBottom>
            Stats:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(resource.stats).map(([stat, value]) => (
              <Box key={stat} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={statDefinitions[stat as keyof typeof statDefinitions]?.name || stat}>
                  <Typography variant="caption" sx={{ minWidth: 30 }}>
                    {statDefinitions[stat as keyof typeof statDefinitions]?.label || stat}:
                  </Typography>
                </Tooltip>
                <LinearProgress
                  variant="determinate"
                  value={value ? (value / 1000) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    flexGrow: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: statDefinitions[stat as keyof typeof statDefinitions]?.color || 'primary.main',
                    },
                  }}
                />
                <Typography variant="caption">{value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        <Typography variant="caption" color="text.secondary" display="block">
          Available since: {formatDate(resource.availableTimestamp)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
