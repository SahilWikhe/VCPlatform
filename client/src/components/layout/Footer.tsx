import React from 'react';
import { Box, Container, Typography, Link, Grid, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              VC Platform
            </Typography>
            <Typography variant="body2" color="inherit">
              Connecting startups with investors for funding and partnership opportunities.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Home
              </Link>
              <Link component={RouterLink} to="/startups" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Startups
              </Link>
              <Link component={RouterLink} to="/investors" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Investors
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" sx={{ display: 'block', mb: 1 }}>
                About Us
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="inherit" paragraph>
              Email: info@vcplatform.com
            </Typography>
            <Typography variant="body2" color="inherit">
              Phone: +1 (123) 456-7890
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3} pt={3} borderTop={`1px solid ${theme.palette.grey[800]}`}>
          <Typography variant="body2" color="inherit" align="center">
            © {currentYear} VC Platform. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 