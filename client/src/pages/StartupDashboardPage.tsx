import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const StartupDashboardPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Startup Dashboard
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            This page is under construction. Please check back later.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default StartupDashboardPage; 