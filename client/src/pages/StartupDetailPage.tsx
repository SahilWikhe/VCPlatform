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
  CalendarToday,
  ArrowBack,
} from '@mui/icons-material';
import { useAuth, UserRole } from '../context/AuthContext';
import { startupAPI } from '../services/api';
import { Startup } from '../types/startup';

const StartupDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await startupAPI.getById(id);
        setStartup(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load startup details');
      } finally {
        setLoading(false);
      }
    };

    fetchStartupDetails();
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

  if (error || !startup) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Startup not found'}</Alert>
        <Button
          component={RouterLink}
          to="/startups"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Startups
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        component={RouterLink}
        to="/startups"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Startups
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={startup.logoUrl}
                alt={startup.name}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {startup.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {startup.tagline}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {startup.industry && (
                    <Chip
                      icon={<Category fontSize="small" />}
                      label={startup.industry}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {startup.stage && (
                    <Chip
                      label={startup.stage}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                  {startup.foundedYear && (
                    <Chip
                      icon={<CalendarToday fontSize="small" />}
                      label={`Founded ${startup.foundedYear}`}
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
              {startup.description}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Company Details
              </Typography>
              <List dense>
                {startup.location && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={startup.location} secondary="Location" />
                  </ListItem>
                )}
                {startup.teamSize && (
                  <ListItem>
                    <ListItemIcon>
                      <People color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={`${startup.teamSize} employees`} secondary="Team Size" />
                  </ListItem>
                )}
                {startup.fundingStage && (
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={startup.fundingStage} secondary="Funding Stage" />
                  </ListItem>
                )}
                {startup.fundingAmount && (
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={`$${startup.fundingAmount.toLocaleString()}`} secondary="Funding Raised" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>

          {startup.problem && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Problem
              </Typography>
              <Typography variant="body1" paragraph>
                {startup.problem}
              </Typography>
            </Paper>
          )}

          {startup.solution && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Solution
              </Typography>
              <Typography variant="body1" paragraph>
                {startup.solution}
              </Typography>
            </Paper>
          )}

          {startup.businessModel && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Business Model
              </Typography>
              <Typography variant="body1" paragraph>
                {startup.businessModel}
              </Typography>
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
              {startup.website && (
                <ListItem>
                  <ListItemIcon>
                    <Language color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={startup.website} target="_blank" rel="noopener">
                        {startup.website.replace(/^https?:\/\//, '')}
                      </Link>
                    }
                    secondary="Website"
                  />
                </ListItem>
              )}
              {startup.linkedIn && (
                <ListItem>
                  <ListItemIcon>
                    <LinkedIn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={startup.linkedIn} target="_blank" rel="noopener">
                        LinkedIn
                      </Link>
                    }
                  />
                </ListItem>
              )}
              {startup.twitter && (
                <ListItem>
                  <ListItemIcon>
                    <Twitter color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link href={startup.twitter} target="_blank" rel="noopener">
                        Twitter
                      </Link>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>

          {isAuthenticated && user?.role === UserRole.INVESTOR && (
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
                Contact Startup
              </Button>
            </Paper>
          )}

          {startup.pitchDeckUrl && (
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                href={startup.pitchDeckUrl}
                target="_blank"
                startIcon={<Description />}
                sx={{ mt: 1 }}
              >
                View Pitch Deck
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Contact {startup.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send a message to {startup.name} to express your interest or ask questions.
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

export default StartupDetailPage; 