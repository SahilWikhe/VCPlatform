import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Avatar, 
  Button, Chip, Divider, CircularProgress, Alert, 
  TextField, MenuItem, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Investor, InvestorType } from '../types/investor';
import { investorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FundingStage } from '../types/startup';

const InvestorProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Investor>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [profileExists, setProfileExists] = useState<boolean>(true);
  
  // Dialog states
  const [teamDialog, setTeamDialog] = useState({ open: false, index: -1 });
  const [portfolioDialog, setPortfolioDialog] = useState({ open: false, index: -1 });
  const [teamMember, setTeamMember] = useState({ name: '', role: '', title: '', bio: '' });
  const [portfolioCompany, setPortfolioCompany] = useState({ name: '', website: '', description: '' });

  useEffect(() => {
    fetchInvestorProfile();
  }, []);

  const fetchInvestorProfile = async () => {
    setLoading(true);
    try {
      const response = await investorAPI.getProfile();
      setInvestor(response.data);
      setFormData(response.data);
      setProfileExists(true);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Profile doesn't exist yet
        setProfileExists(false);
        setIsEditing(true);
        // Initialize with default values
        setFormData({
          firmName: '',
          description: '',
          investorType: InvestorType.ANGEL,
          location: '',
        });
      } else {
        setError(err.response?.data?.message || 'Failed to load investor profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayInputChange = (name: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData({ ...formData, [name]: array });
  };

  const handleInvestmentSizeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setFormData({
      ...formData,
      investmentSize: {
        ...(formData.investmentSize || { min: 0, max: 0 }),
        [type]: numValue
      }
    });
  };

  const handleSaveProfile = async () => {
    try {
      if (profileExists) {
        await investorAPI.updateProfile(formData);
        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      } else {
        await investorAPI.createProfile(formData);
        setSnackbar({ open: true, message: 'Profile created successfully', severity: 'success' });
        setProfileExists(true);
      }
      fetchInvestorProfile();
      setIsEditing(false);
    } catch (err: any) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to save profile', 
        severity: 'error' 
      });
    }
  };

  // Team member handlers
  const handleAddTeamMember = () => {
    setTeamMember({ name: '', role: '', title: '', bio: '' });
    setTeamDialog({ open: true, index: -1 });
  };

  const handleEditTeamMember = (index: number) => {
    if (investor?.team && investor.team[index]) {
      const member = investor.team[index];
      setTeamMember({ 
        name: member.name, 
        role: member.role, 
        title: member.title || '', 
        bio: member.bio || '' 
      });
      setTeamDialog({ open: true, index });
    }
  };

  const handleSaveTeamMember = () => {
    const newTeam = [...(formData.team || [])];
    
    if (teamDialog.index === -1) {
      newTeam.push(teamMember);
    } else {
      newTeam[teamDialog.index] = teamMember;
    }
    
    setFormData({ ...formData, team: newTeam });
    setTeamDialog({ open: false, index: -1 });
  };

  const handleDeleteTeamMember = (index: number) => {
    const newTeam = [...(formData.team || [])];
    newTeam.splice(index, 1);
    setFormData({ ...formData, team: newTeam });
  };

  // Portfolio company handlers
  const handleAddPortfolioCompany = () => {
    setPortfolioCompany({ name: '', website: '', description: '' });
    setPortfolioDialog({ open: true, index: -1 });
  };

  const handleEditPortfolioCompany = (index: number) => {
    if (investor?.portfolio && investor.portfolio[index]) {
      const company = investor.portfolio[index];
      setPortfolioCompany({ 
        name: company.name, 
        website: company.website || '', 
        description: company.description || '' 
      });
      setPortfolioDialog({ open: true, index });
    }
  };

  const handleSavePortfolioCompany = () => {
    const newPortfolio = [...(formData.portfolio || [])];
    
    if (portfolioDialog.index === -1) {
      newPortfolio.push(portfolioCompany);
    } else {
      newPortfolio[portfolioDialog.index] = portfolioCompany;
    }
    
    setFormData({ ...formData, portfolio: newPortfolio });
    setPortfolioDialog({ open: false, index: -1 });
  };

  const handleDeletePortfolioCompany = (index: number) => {
    const newPortfolio = [...(formData.portfolio || [])];
    newPortfolio.splice(index, 1);
    setFormData({ ...formData, portfolio: newPortfolio });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && profileExists) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {profileExists ? 'Investor Profile' : 'Create Investor Profile'}
          </Typography>
          {profileExists && (
            <Button 
              variant="contained" 
              color={isEditing ? "primary" : "secondary"}
              startIcon={isEditing ? null : <EditIcon />}
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Button>
          )}
        </Box>

        {!profileExists && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You don't have an investor profile yet. Please create one by filling out the form below.
          </Alert>
        )}

        {isEditing ? (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Firm Name"
                  name="firmName"
                  value={formData.firmName || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Investor Type"
                  name="investorType"
                  value={formData.investorType || ''}
                  onChange={handleSelectChange}
                  required
                >
                  {Object.values(InvestorType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Founded Year"
                  name="foundedYear"
                  type="number"
                  value={formData.foundedYear || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Team Size"
                  name="teamSize"
                  type="number"
                  value={formData.teamSize || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assets Under Management (AUM)"
                  name="aum"
                  type="number"
                  value={formData.aum || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tagline"
                  name="tagline"
                  value={formData.tagline || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Investment Thesis"
                  name="investmentThesis"
                  value={formData.investmentThesis || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min Investment Size ($)"
                  type="number"
                  value={formData.investmentSize?.min || ''}
                  onChange={(e) => handleInvestmentSizeChange('min', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Investment Size ($)"
                  type="number"
                  value={formData.investmentSize?.max || ''}
                  onChange={(e) => handleInvestmentSizeChange('max', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Preferred Industries (comma separated)"
                  value={(formData.preferredIndustries || []).join(', ')}
                  onChange={(e) => handleArrayInputChange('preferredIndustries', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  SelectProps={{ multiple: true }}
                  label="Preferred Funding Stages"
                  value={formData.preferredStages || []}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    preferredStages: e.target.value as unknown as FundingStage[] 
                  })}
                >
                  {Object.values(FundingStage).map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Social Media</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="linkedIn"
                  value={formData.linkedIn || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  name="twitter"
                  value={formData.twitter || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Team Members</Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={handleAddTeamMember}
                    variant="outlined"
                  >
                    Add Team Member
                  </Button>
                </Box>
              </Grid>
              
              {(formData.team || []).map((member, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1">{member.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {member.role} {member.title ? `- ${member.title}` : ''}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditTeamMember(index)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteTeamMember(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Portfolio Companies</Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={handleAddPortfolioCompany}
                    variant="outlined"
                  >
                    Add Portfolio Company
                  </Button>
                </Box>
              </Grid>
              
              {(formData.portfolio || []).map((company, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1">{company.name}</Typography>
                        {company.website && (
                          <Typography variant="body2" color="primary">
                            {company.website}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => handleEditPortfolioCompany(index)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeletePortfolioCompany(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : (
          <>
            {investor && (
              <>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Avatar
                        src={investor.logoUrl}
                        alt={investor.firmName}
                        sx={{ width: 150, height: 150, mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Typography variant="h5" gutterBottom>{investor.firmName}</Typography>
                      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        {investor.investorType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip label={investor.location} size="small" />
                        {investor.foundedYear && (
                          <Chip label={`Founded ${investor.foundedYear}`} size="small" />
                        )}
                        {investor.teamSize && (
                          <Chip label={`Team of ${investor.teamSize}`} size="small" />
                        )}
                      </Box>
                      
                      {investor.tagline && (
                        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                          "{investor.tagline}"
                        </Typography>
                      )}
                      
                      <Typography variant="body1">{investor.description}</Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        {investor.website && (
                          <Button 
                            href={investor.website.startsWith('http') ? investor.website : `https://${investor.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mr: 1 }}
                          >
                            Website
                          </Button>
                        )}
                        {investor.linkedIn && (
                          <Button 
                            href={investor.linkedIn.startsWith('http') ? investor.linkedIn : `https://linkedin.com/in/${investor.linkedIn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mr: 1 }}
                          >
                            LinkedIn
                          </Button>
                        )}
                        {investor.twitter && (
                          <Button 
                            href={investor.twitter.startsWith('http') ? investor.twitter : `https://twitter.com/${investor.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Twitter
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>Investment Focus</Typography>
                      
                      {investor.investmentThesis && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>Investment Thesis</Typography>
                          <Typography variant="body2">{investor.investmentThesis}</Typography>
                        </Box>
                      )}
                      
                      {investor.investmentSize && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>Investment Size</Typography>
                          <Typography variant="body2">
                            ${investor.investmentSize.min.toLocaleString()} - ${investor.investmentSize.max.toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                      
                      {investor.preferredStages && investor.preferredStages.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>Preferred Stages</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {investor.preferredStages.map((stage, index) => (
                              <Chip 
                                key={index} 
                                label={stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                                size="small" 
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {investor.preferredIndustries && investor.preferredIndustries.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>Preferred Industries</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {investor.preferredIndustries.map((industry, index) => (
                              <Chip key={index} label={industry} size="small" />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>Team</Typography>
                      
                      {investor.team && investor.team.length > 0 ? (
                        investor.team.map((member, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">{member.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {member.role} {member.title ? `- ${member.title}` : ''}
                            </Typography>
                            {member.bio && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {member.bio}
                              </Typography>
                            )}
                            {index < investor.team!.length - 1 && <Divider sx={{ my: 2 }} />}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2">No team members added yet.</Typography>
                      )}
                    </Paper>
                  </Grid>
                  
                  {investor.portfolio && investor.portfolio.length > 0 && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Portfolio Companies</Typography>
                        <Grid container spacing={2}>
                          {investor.portfolio.map((company, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1">{company.name}</Typography>
                                {company.website && (
                                  <Typography variant="body2" color="primary" component="a" href={company.website} target="_blank">
                                    {company.website}
                                  </Typography>
                                )}
                                {company.description && (
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    {company.description}
                                  </Typography>
                                )}
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
      
      {/* Team Member Dialog */}
      <Dialog open={teamDialog.open} onClose={() => setTeamDialog({ open: false, index: -1 })}>
        <DialogTitle>{teamDialog.index === -1 ? 'Add Team Member' : 'Edit Team Member'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={teamMember.name}
            onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Role"
            value={teamMember.role}
            onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Title"
            value={teamMember.title}
            onChange={(e) => setTeamMember({ ...teamMember, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Bio"
            value={teamMember.bio}
            onChange={(e) => setTeamMember({ ...teamMember, bio: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeamDialog({ open: false, index: -1 })}>Cancel</Button>
          <Button onClick={handleSaveTeamMember} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Portfolio Company Dialog */}
      <Dialog open={portfolioDialog.open} onClose={() => setPortfolioDialog({ open: false, index: -1 })}>
        <DialogTitle>{portfolioDialog.index === -1 ? 'Add Portfolio Company' : 'Edit Portfolio Company'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Company Name"
            value={portfolioCompany.name}
            onChange={(e) => setPortfolioCompany({ ...portfolioCompany, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Website"
            value={portfolioCompany.website}
            onChange={(e) => setPortfolioCompany({ ...portfolioCompany, website: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={portfolioCompany.description}
            onChange={(e) => setPortfolioCompany({ ...portfolioCompany, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPortfolioDialog({ open: false, index: -1 })}>Cancel</Button>
          <Button onClick={handleSavePortfolioCompany} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />

      {!profileExists && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleSaveProfile}
          >
            Create Profile
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default InvestorProfilePage;    