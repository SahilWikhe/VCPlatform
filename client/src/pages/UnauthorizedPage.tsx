import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

const UnauthorizedPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <BlockIcon sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="h6" component="h2" color="text.secondary" paragraph sx={{ maxWidth: 600, mb: 4 }}>
          You don't have permission to access this page. Please contact the administrator if you believe this is an error.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/" size="large">
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage; 