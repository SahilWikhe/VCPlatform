import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Global } from '@emotion/react';
import theme from './styles/theme';
import globalStyles from './styles/globalStyles';
import { AuthProvider, UserRole } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

// Public Pages
import HomePage from './pages/HomePage';
import StartupListPage from './pages/StartupListPage';
import InvestorListPage from './pages/InvestorListPage';
import StartupDetailPage from './pages/StartupDetailPage';
import InvestorDetailPage from './pages/InvestorDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Protected Pages
import ProfilePage from './pages/ProfilePage';
import StartupDashboardPage from './pages/StartupDashboardPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';
import StartupProfilePage from './pages/StartupProfilePage';
import InvestorProfilePage from './pages/InvestorProfilePage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/startups" element={<StartupListPage />} />
              <Route path="/startups/:id" element={<StartupDetailPage />} />
              <Route path="/investors" element={<InvestorListPage />} />
              <Route path="/investors/:id" element={<InvestorDetailPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes - Any authenticated user */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Protected Routes - Startup only */}
              <Route element={<ProtectedRoute allowedRoles={[UserRole.STARTUP]} />}>
                <Route path="/startup/dashboard" element={<StartupDashboardPage />} />
                <Route path="/startup/profile" element={<StartupProfilePage />} />
              </Route>

              {/* Protected Routes - Investor only */}
              <Route element={<ProtectedRoute allowedRoles={[UserRole.INVESTOR]} />}>
                <Route path="/investor/dashboard" element={<InvestorDashboardPage />} />
                <Route path="/investor/profile" element={<InvestorProfilePage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
