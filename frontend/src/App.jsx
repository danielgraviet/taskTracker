// taskTracker/frontend/src/App.jsx

import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Import your new component
import TaskForm from './components/TaskForm'; // Make sure the path is correct

const theme = createTheme({
  // ... (your theme definition from before)
  palette: {
    primary: { main: '#007bff' },
    secondary: { main: '#6c757d' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500, marginBottom: '1rem' },
    h2: { fontSize: '2rem', fontWeight: 500, marginBottom: '0.75rem' },
    h5: { fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' } // Added for form title
  }
});

function App() {
  // Placeholder function for handling saved tasks - will be developed further
  const handleSaveTask = (taskData) => {
    console.log('Task to be saved in App.jsx:', taskData);
    // Later: Add taskData to a list of tasks, persist to localStorage or API
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md"> {/* Changed to md for a slightly narrower form area */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom align="center">
            Internship Task Tracker
          </Typography>

          {/* Add the TaskForm here */}
          <TaskForm
            onSaveTask={handleSaveTask}
            // editingTask={null} // We'll pass actual data later for editing
            // onCancelEdit={() => {}} // Placeholder for now
          />

          {/* Placeholder for TaskList - we'll add this next */}
          <Typography variant="h2" component="h2" sx={{ mt: 5 }}>
            Tasks
          </Typography>
          <Box sx={{ mt: 2, p: 2, border: '1px dashed grey' }}>
            Task list will appear here...
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;