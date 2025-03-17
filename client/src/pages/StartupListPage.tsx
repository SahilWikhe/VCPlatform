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
import { startupAPI } from '../services/api';
import { FundingStage, Startup } from '../types/startup';

const StartupListPage: React.FC = () => {
  const theme = useTheme();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    fundingStage: '',
  });

  useEffect(() => {
    fetchStartups();
  }, [page, filters]);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const params: {
        industry: string;
        location: string;
        fundingStage: string;
        page: number;
        limit: number;
        [key: string]: string | number;
      } = {
        industry: filters.industry,
        location: filters.location,
        fundingStage: filters.fundingStage,
        page,
        limit: 9,
      };
      
      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await startupAPI.getAll(params);
      setStartups(response.data.startups);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch startups');
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
      industry: '',
      location: '',
      fundingStage: '',
    });
    setPage(1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Startups
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find promising startups across various industries and stages.
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filter Startups
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Industry"
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
              placeholder="e.g. Fintech, Healthcare"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. San Francisco, London"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Funding Stage</InputLabel>
              <Select
                name="fundingStage"
                value={filters.fundingStage}
                label="Funding Stage"
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
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>

      {/* Startup List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={fetchStartups} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      ) : startups.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">No startups found matching your criteria</Typography>
          <Button variant="contained" onClick={clearFilters} sx={{ mt: 2 }}>
            Clear Filters
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {startups.map((startup) => (
              <Grid item xs={12} sm={6} md={4} key={startup._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {startup.companyName}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={startup.fundingStage.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                      <Chip 
                        label={startup.location} 
                        variant="outlined" 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {startup.description.length > 150
                        ? `${startup.description.substring(0, 150)}...`
                        : startup.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {Array.isArray(startup.industry) 
                        ? startup.industry.slice(0, 3).map((ind: string, index: number) => (
                            <Chip 
                              key={index} 
                              label={ind} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          ))
                        : (
                            <Chip 
                              label={startup.industry} 
                              size="small" 
                              sx={{ mr: 0.5, mb: 0.5 }} 
                            />
                          )
                      }
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      component={RouterLink} 
                      to={`/startups/${startup._id}`} 
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

export default StartupListPage; 