import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Chip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { investorAPI } from '../services/api';
import { InvestorType, Investor } from '../types/investor';
import { FundingStage } from '../types/startup';

const InvestorListPage: React.FC = () => {
  const theme = useTheme();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    investorType: '',
    preferredIndustries: '',
    preferredStages: '',
    location: '',
  });

  useEffect(() => {
    fetchInvestors();
  }, [page, filters]);

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const params: {
        investorType: string;
        preferredIndustries: string;
        preferredStages: string;
        location: string;
        page: number;
        limit: number;
        [key: string]: string | number;
      } = {
        investorType: filters.investorType,
        preferredIndustries: filters.preferredIndustries,
        preferredStages: filters.preferredStages,
        location: filters.location,
        page,
        limit: 9,
      };
      
      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await investorAPI.getAll(params);
      setInvestors(response.data.investors);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch investors');
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const clearFilters = () => {
    setFilters({
      investorType: '',
      preferredIndustries: '',
      preferredStages: '',
      location: '',
    });
    setPage(1);
  };

  // Helper function to format investor type for display
  const formatInvestorType = (type: string): string => {
    return type
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Investors
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find investors and venture capital firms looking for promising startups.
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filter Investors
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Investor Type</InputLabel>
              <Select
                name="investorType"
                value={filters.investorType}
                label="Investor Type"
                onChange={handleFilterChange as any}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value={InvestorType.ANGEL}>Angel Investor</MenuItem>
                <MenuItem value={InvestorType.VC_FIRM}>VC Firm</MenuItem>
                <MenuItem value={InvestorType.CORPORATE}>Corporate</MenuItem>
                <MenuItem value={InvestorType.ACCELERATOR}>Accelerator</MenuItem>
                <MenuItem value={InvestorType.FAMILY_OFFICE}>Family Office</MenuItem>
                <MenuItem value={InvestorType.OTHER}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Industry Focus"
              name="preferredIndustries"
              value={filters.preferredIndustries}
              onChange={handleFilterChange}
              placeholder="e.g. Fintech, Healthcare"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Stage Focus</InputLabel>
              <Select
                name="preferredStages"
                value={filters.preferredStages}
                label="Stage Focus"
                onChange={handleFilterChange as any}
              >
                <MenuItem value="">All Stages</MenuItem>
                <MenuItem value={FundingStage.IDEA}>Idea</MenuItem>
                <MenuItem value={FundingStage.PRE_SEED}>Pre-Seed</MenuItem>
                <MenuItem value={FundingStage.SEED}>Seed</MenuItem>
                <MenuItem value={FundingStage.SERIES_A}>Series A</MenuItem>
                <MenuItem value={FundingStage.SERIES_B}>Series B</MenuItem>
                <MenuItem value={FundingStage.SERIES_C}>Series C</MenuItem>
                <MenuItem value={FundingStage.LATER_STAGE}>Later Stage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. San Francisco, London"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>

      {/* Investor List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={fetchInvestors} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      ) : investors.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">No investors found matching your criteria</Typography>
          <Button variant="contained" onClick={clearFilters} sx={{ mt: 2 }}>
            Clear Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {investors.map((investor) => (
              <Grid item xs={12} sm={6} md={4} key={investor._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {investor.firmName}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={formatInvestorType(investor.investorType)} 
                        color="secondary" 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                      <Chip 
                        label={investor.location} 
                        variant="outlined" 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {investor.description.length > 150
                        ? `${investor.description.substring(0, 150)}...`
                        : investor.description}
                    </Typography>
                    
                    {investor.preferredIndustries && investor.preferredIndustries.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          Industry Focus:
                        </Typography>
                        <Box>
                          {investor.preferredIndustries.slice(0, 3).map((ind, index) => (
                            <Chip 
                              key={index} 
                              label={ind} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          ))}
                          {investor.preferredIndustries.length > 3 && (
                            <Chip 
                              label={`+${investor.preferredIndustries.length - 3}`} 
                              size="small" 
                              variant="outlined" 
                              sx={{ mb: 0.5 }} 
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      component={RouterLink} 
                      to={`/investors/${investor._id}`} 
                      size="small" 
                      color="primary"
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default InvestorListPage; 