import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Resource } from '../../types/Resource';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

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

interface StatChartProps {
  resource: Resource;
}

/**
 * Stat chart component for displaying resource stats in a radar chart
 */
const StatChart: React.FC<StatChartProps> = ({ resource }) => {
  const theme = useTheme();

  // Prepare data for the radar chart
  const prepareChartData = () => {
    const labels: string[] = [];
    const values: number[] = [];
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    // Add stats to the chart data
    Object.entries(resource.stats).forEach(([stat, value]) => {
      const statDef = statDefinitions[stat as keyof typeof statDefinitions];
      labels.push(statDef?.label || stat);
      values.push(value || 0);
      backgroundColors.push(`${statDef?.color || theme.palette.primary.main}33`); // Add 33 for 20% opacity
      borderColors.push(statDef?.color || theme.palette.primary.main);
    });

    return {
      labels,
      datasets: [
        {
          label: resource.name,
          data: values,
          backgroundColor: backgroundColors.length > 0 ? backgroundColors[0] : 'rgba(255, 99, 132, 0.2)',
          borderColor: borderColors.length > 0 ? borderColors[0] : 'rgb(255, 99, 132)',
          borderWidth: 2,
          pointBackgroundColor: borderColors,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: borderColors,
        },
      ],
    };
  };

  // Chart options
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: theme.palette.divider,
        },
        grid: {
          color: theme.palette.divider,
        },
        pointLabels: {
          color: theme.palette.text.primary,
        },
        ticks: {
          backdropColor: 'transparent',
          color: theme.palette.text.secondary,
        },
        suggestedMin: 0,
        suggestedMax: 1000,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <Radar data={prepareChartData()} options={options} />
    </Box>
  );
};

export default StatChart;
