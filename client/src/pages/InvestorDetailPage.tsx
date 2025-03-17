import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Chip,
  Avatar,
  Button,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Business,
  LocationOn,
  Language,
  LinkedIn,
  Twitter,
  AttachMoney,
  Category,
  Description,
  People,
  ArrowBack,
} from '@mui/icons-material';
import { useAuth, UserRole } from '../context/AuthContext';
import { investorAPI } from '../services/api';
import { Investor } from '../types/investor';

const InvestorDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await investorAPI.getById(id);
        setInvestor(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load investor details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorDetails();
  }, [id]);

  const handleClickOpen = () => {
    setOpen(true);
    setMessage('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendRequest = async () => {
    // Connection functionality removed
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !investor) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Investor not found'}</Alert>
        <Button
          component={RouterLink}
          to="/investors"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Investors
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to="/investors"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Investors
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={investor.logoUrl}
                alt={investor.firmName}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {investor.firmName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {investor.tagline}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {investor.investorType && (
                    <Chip
                      label={investor.investorType}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {investor.location && (
                    <Chip
                      icon={<LocationOn fontSize="small" />}
                      label={investor.location}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" paragraph>
              {investor.description}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Investment Focus
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {investor.industries && investor.industries.map((industry, index) => (
                  <Chip
                    key={index}
                    icon={<Category fontSize="small" />}
                    label={industry}
                    size="small"
                  />
                ))}
              </Box>

              <Grid container spacing={2}>
                {investor.investmentStages && investor.investmentStages.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Investment Stages
                    </Typography>
                    <List dense>
                      {investor.investmentStages.map((stage, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemText primary={stage} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}

                {investor.investmentSizes && investor.investmentSizes.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Investment Sizes
                    </Typography>
                    <List dense>
                      {investor.investmentSizes.map((size, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemText primary={`$${size.toLocaleString()}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>

          {investor.portfolio && investor.portfolio.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Companies
              </Typography>
              <Grid container spacing={2}>
                {investor.portfolio.map((company, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {company.name}
                      </Typography>
                      {company.description && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {company.description}
                        </Typography>
                      )}
                      {company.website && (
                        <Link href={company.website} target="_blank" rel="noopener" sx={{ mt: 1, display: 'block' }}>
                          Visit Website
                        </Link>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {investor.team && investor.team.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Team
              </Typography>
              <Grid container spacing={2}>
                {investor.team.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={member.photoUrl} alt={member.name} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1">{member.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Contact & Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <List dense>
              {investor.website && (
                <ListItem>
                  <ListItemIcon>
                    <Language color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={investor.website} target="_blank" rel="noopener">
                        {investor.website.replace(/^https?:\/\//, '')}
                      </Link>
                    }
                    secondary="Website"
                  />
                </ListItem>
              )}
              {investor.linkedIn && (
                <ListItem>
                  <ListItemIcon>
                    <LinkedIn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={investor.linkedIn} target="_blank" rel="noopener">
                        LinkedIn
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {investor.twitter && (
                <ListItem>
                  <ListItemIcon>
                    <Twitter color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={investor.twitter} target="_blank" rel="noopener">
                        Twitter
                      </Link>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>

          {isAuthenticated && user?.role === UserRole.STARTUP && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleClickOpen}
                sx={{ mt: 1 }}
              >
                Contact Investor
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Contact {investor.firmName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send a message to {investor.firmName} to express your interest or ask questions.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Your Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSendRequest} 
            color="primary" 
            variant="contained"
            disabled={connecting || !message.trim()}
          >
            {connecting ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvestorDetailPage; 