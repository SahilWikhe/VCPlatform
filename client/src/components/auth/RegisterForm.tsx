import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import { useAuth, UserRole } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, error, clearError, isLoading, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STARTUP,
  });

  const [formErrors, setFormErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  // Redirect based on user role after successful registration
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === UserRole.STARTUP) {
        navigate('/startup/dashboard');
      } else if (user.role === UserRole.INVESTOR) {
        navigate('/investor/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear any form errors
    if (name === 'password' || name === 'confirmPassword') {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    
    if (error) clearError();
  };

  const handleRoleChange = (e: SelectChangeEvent<UserRole>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as UserRole,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      password: '',
      confirmPassword: '',
    };

    // Validate password length
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { name, email, password, role } = formData;
    await register(name, email, password, role);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">I am a</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            value={formData.role}
            label="I am a"
            onChange={handleRoleChange}
          >
            <MenuItem value={UserRole.STARTUP}>Startup</MenuItem>
            <MenuItem value={UserRole.INVESTOR}>Investor</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
        
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary">
                Login here
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RegisterForm; 