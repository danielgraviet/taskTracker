// taskTracker/frontend/src/App.jsx

import React from 'react'; // Not strictly necessary in newer React versions for JSX, but good practice
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Optional: Define a basic theme (you can expand this later)
const theme = createTheme({
  palette: {
    // mode: 'light', // or 'dark'
    primary: {
      main: '#007bff', // Example primary color (your old button blue)
    },
    secondary: {
      main: '#6c757d', // Example secondary color (your old reset button gray)
    },
    // You can also customize typography, breakpoints, etc.
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Ensure Roboto is primary
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 500,
        marginBottom: '0.75rem',
    }
    // ... other typography settings
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies baseline styling normalization */}
      <Container maxWidth="lg"> {/* MUI Container for centering and max-width */}
        <Box sx={{ my: 4 }}> {/* MUI Box for margins/padding and other sx props */}
          <Typography variant="h1" component="h1" gutterBottom align="center">
            Internship Task Tracker
          </Typography>
          {/*
            This is where your main components like TaskForm, Controls, TaskList will go.
            For now, let's just put a placeholder.
          */}
          <Typography variant="h2" component="h2">
            Coming Soon: Task Management!
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;