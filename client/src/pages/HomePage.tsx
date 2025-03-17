import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useAuth, UserRole } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <BusinessIcon fontSize="large" color="primary" />,
      title: 'For Startups',
      description: 'Create a compelling profile to showcase your startup to potential investors. Highlight your traction, team, and vision.',
    },
    {
      icon: <MonetizationOnIcon fontSize="large" color="primary" />,
      title: 'For Investors',
      description: 'Discover promising startups across various industries and stages. Filter by criteria that match your investment thesis.',
    },
    {
      icon: <HandshakeIcon fontSize="large" color="primary" />,
      title: 'Make Connections',
      description: 'Connect directly with startups or investors. Initiate conversations and explore potential partnerships.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          borderRadius: { xs: 0, md: 2 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Connect Startups with Investors
              </Typography>
              <Typography variant="h5" paragraph>
                A platform for startups to gain exposure and find funding opportunities, and for investors to discover promising ventures.
              </Typography>
              <Box sx={{ mt: 4 }}>
                {isAuthenticated ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    component={RouterLink}
                    to={user?.role === UserRole.STARTUP ? '/startup/dashboard' : '/investor/dashboard'}
                    sx={{ mr: 2 }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      component={RouterLink}
                      to="/register"
                      sx={{ mr: 2 }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      component={RouterLink}
                      to="/login"
                    >
                      Login
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.svg"
                alt="Startup and investor connection"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  display: { xs: 'none', md: 'block' },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: theme.palette.grey[100], py: 6, mb: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to Connect?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join our platform today and start building valuable connections in the startup ecosystem.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            {!isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/register"
              >
                Sign Up Now
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to={user?.role === UserRole.STARTUP ? '/investors' : '/startups'}
              >
                Explore {user?.role === UserRole.STARTUP ? 'Investors' : 'Startups'}
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 