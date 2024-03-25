import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import VNetDetails from './VNetDetails';
import CheckIP from './CheckIP';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { msalInstance } from './authConfig';

const StyledLink = styled(Link)({
  color: 'white',
  textDecoration: 'none',
  marginRight: '16px',
  padding: '6px 16px',
  border: '1px solid white',
  borderRadius: '4px',
  '&:hover': {
    color: '#bbdefb',
    borderColor: '#bbdefb',
  },
});

function SignInSignOutButton() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginRedirect().catch(e => console.error(e));
  };

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" }).catch(e => console.error(e));
  };

  return isAuthenticated ? (
    <StyledLink to="/" onClick={handleLogout}>
      Log out
    </StyledLink>
  ) : (
    <StyledLink to="/" onClick={handleLogin}>
      Log in
    </StyledLink>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function Home() {
  return (
    <Typography variant="h4" gutterBottom>Welcome to Azure IPAM</Typography>
  );
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <AppBar position="static" sx={{ backgroundColor: '#0078D4' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ color: 'white', flexGrow: 1 }}>
              Azure IPAM
            </Typography>
            <nav style={{ display: 'flex' }}>
              <StyledLink to="/vnets">VNet Details</StyledLink>
              <StyledLink to="/check-ip">CheckIP</StyledLink>
              <SignInSignOutButton />
            </nav>
          </Toolbar>
        </AppBar>

        <Container style={{ marginTop: '20px' }} maxWidth={false}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vnets" element={<ProtectedRoute><VNetDetails /></ProtectedRoute>} />
            <Route path="/check-ip" element={<ProtectedRoute><CheckIP /></ProtectedRoute>} />
          </Routes>
        </Container>
      </Router>
    </MsalProvider>
  );
}

export default App;
