import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Business,
  LocationOn,
  People,
  CalendarToday,
  AttachMoney,
  Category,
  Description,
  Language,
  LinkedIn,
  Twitter,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { startupAPI } from '../services/api';
import { Startup, FundingStage } from '../types/startup';

const StartupProfilePage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Startup>>({});
  const [industryInput, setIndustryInput] = useState<string>('');
  const [industryDialogOpen, setIndustryDialogOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState<boolean>(true);

  // Fetch startup profile data
  useEffect(() => {
    const fetchStartupProfile = async () => {
      try {
        setLoading(true);
        const response = await startupAPI.getProfile();
        setStartup(response.data);
        setFormData(response.data);
        setProfileExists(true);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Profile doesn't exist yet
          setProfileExists(false);
          setIsEditing(true);
          setFormData({
            companyName: '',
            description: '',
            industry: [],
            location: '',
            foundedYear: new Date().getFullYear(),
            teamSize: 1,
            fundingStage: FundingStage.IDEA,
          });
        } else {
          setError(err.response?.data?.message || 'Failed to load startup profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStartupProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setFormData(startup || {});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddIndustry = () => {
    if (!industryInput.trim()) return;
    
    const currentIndustries = Array.isArray(formData.industry) 
      ? [...formData.industry] 
      : formData.industry 
        ? [formData.industry] 
        : [];
    
    setFormData({
      ...formData,
      industry: [...currentIndustries, industryInput.trim()],
    });
    
    setIndustryInput('');
    setIndustryDialogOpen(false);
  };

  const handleRemoveIndustry = (index: number) => {
    if (!Array.isArray(formData.industry)) return;
    
    const updatedIndustries = [...formData.industry];
    updatedIndustries.splice(index, 1);
    
    setFormData({
      ...formData,
      industry: updatedIndustries,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (profileExists) {
        await startupAPI.updateProfile(formData);
      } else {
        await startupAPI.createProfile(formData);
        setProfileExists(true);
      }
      const response = await startupAPI.getProfile();
      setStartup(response.data);
      setIsEditing(false);
      setSuccessMessage(profileExists ? 'Profile updated successfully!' : 'Profile created successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  if (loading && !startup && profileExists) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !startup && profileExists) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {profileExists ? 'Startup Profile' : 'Create Startup Profile'}
        </Typography>
        {profileExists && (
          <Button
            variant={isEditing ? "outlined" : "contained"}
            color={isEditing ? "error" : "primary"}
            startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
            onClick={handleEditToggle}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!profileExists && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You don't have a startup profile yet. Please fill out the form below to create one.
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Main Info */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {isEditing ? (
                <TextField
                  name="logoUrl"
                  label="Logo URL"
                  fullWidth
                  value={formData.logoUrl || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Avatar
                  src={startup?.logoUrl}
                  alt={startup?.name || startup?.companyName}
                  sx={{ width: 100, height: 100, mr: 3 }}
                />
              )}
              
              {!isEditing && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {startup?.name || startup?.companyName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {startup?.tagline}
                  </Typography>
                </Box>
              )}
            </Box>

            {isEditing && (
              <>
                <TextField
                  name="companyName"
                  label="Company Name"
                  fullWidth
                  required
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="tagline"
                  label="Tagline"
                  fullWidth
                  value={formData.tagline || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            
            {isEditing ? (
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                required
                value={formData.description || ''}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
              />
            ) : (
              <Typography variant="body1" paragraph>
                {startup?.description}
              </Typography>
            )}

            <Typography variant="h6" gutterBottom>
              Industry
            </Typography>
            
            {isEditing ? (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {Array.isArray(formData.industry) && formData.industry.map((ind, index) => (
                    <Chip
                      key={index}
                      label={ind}
                      onDelete={() => handleRemoveIndustry(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => setIndustryDialogOpen(true)}
                >
                  Add Industry
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {Array.isArray(startup?.industry) ? (
                  startup?.industry.map((ind, index) => (
                    <Chip
                      key={index}
                      icon={<Category fontSize="small" />}
                      label={ind}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                ) : (
                  startup?.industry && (
                    <Chip
                      icon={<Category fontSize="small" />}
                      label={startup.industry}
                      color="primary"
                      variant="outlined"
                    />
                  )
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Problem & Solution
            </Typography>
            
            {isEditing ? (
              <>
                <TextField
                  name="problem"
                  label="Problem"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.problem || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="solution"
                  label="Solution"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.solution || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="businessModel"
                  label="Business Model"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.businessModel || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <>
                {startup?.problem && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Problem</Typography>
                    <Typography variant="body1" paragraph>
                      {startup.problem}
                    </Typography>
                  </Box>
                )}
                
                {startup?.solution && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Solution</Typography>
                    <Typography variant="body1" paragraph>
                      {startup.solution}
                    </Typography>
                  </Box>
                )}
                
                {startup?.businessModel && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Business Model</Typography>
                    <Typography variant="body1" paragraph>
                      {startup.businessModel}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>

          {/* Right Column - Details & Links */}
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Company Details
              </Typography>
              
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="location"
                      label="Location"
                      fullWidth
                      required
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="foundedYear"
                      label="Founded Year"
                      type="number"
                      fullWidth
                      required
                      value={formData.foundedYear || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="teamSize"
                      label="Team Size"
                      type="number"
                      fullWidth
                      required
                      value={formData.teamSize || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <People fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="funding-stage-label">Funding Stage</InputLabel>
                      <Select
                        labelId="funding-stage-label"
                        name="fundingStage"
                        value={formData.fundingStage || ''}
                        onChange={handleSelectChange}
                        label="Funding Stage"
                      >
                        {Object.values(FundingStage).map((stage) => (
                          <MenuItem key={stage} value={stage}>
                            {stage.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="fundingAmount"
                      label="Funding Amount ($)"
                      type="number"
                      fullWidth
                      value={formData.fundingAmount || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  {startup?.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{startup.location}</Typography>
                    </Box>
                  )}
                  
                  {startup?.foundedYear && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">Founded in {startup.foundedYear}</Typography>
                    </Box>
                  )}
                  
                  {startup?.teamSize && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <People fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{startup.teamSize} team members</Typography>
                    </Box>
                  )}
                  
                  {startup?.fundingStage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {startup.fundingStage.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Typography>
                    </Box>
                  )}
                  
                  {startup?.fundingAmount && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        ${startup.fundingAmount.toLocaleString()} raised
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>

            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Online Presence
              </Typography>
              
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="website"
                      label="Website"
                      fullWidth
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Language fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="linkedIn"
                      label="LinkedIn"
                      fullWidth
                      value={formData.linkedIn || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkedIn fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="twitter"
                      label="Twitter"
                      fullWidth
                      value={formData.twitter || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Twitter fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  {startup?.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Language fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <a href={startup.website} target="_blank" rel="noopener noreferrer">
                          {startup.website.replace(/^https?:\/\//, '')}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  
                  {startup?.linkedIn && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LinkedIn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <a href={startup.linkedIn} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Typography>
                    </Box>
                  )}
                  
                  {startup?.twitter && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Twitter fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <a href={startup.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="pitchDeckUrl"
                      label="Pitch Deck URL"
                      fullWidth
                      value={formData.pitchDeckUrl || ''}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="video"
                      label="Video URL"
                      fullWidth
                      value={formData.video || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  {startup?.pitchDeckUrl && (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Description />}
                      href={startup.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mb: 2, width: '100%' }}
                    >
                      View Pitch Deck
                    </Button>
                  )}
                  
                  {startup?.video && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={startup.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ width: '100%' }}
                    >
                      Watch Video
                    </Button>
                  )}
                </Box>
              )}
            </Paper>

            {isEditing && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                onClick={handleSubmit}
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : (profileExists ? 'Save Changes' : 'Create Profile')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Add Industry Dialog */}
      <Dialog open={industryDialogOpen} onClose={() => setIndustryDialogOpen(false)}>
        <DialogTitle>Add Industry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Industry"
            fullWidth
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIndustryDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddIndustry} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Container>
  );
};

export default StartupProfilePage; 