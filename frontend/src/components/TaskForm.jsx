// frontend/src/components/TaskForm.jsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Consistent categories
const CATEGORIES = ['SEO', 'Engineering', 'Writing', 'Frontend', 'Data Analysis', 'Other'];

const TaskForm = ({ onSaveTask, editingTask, onCancelEdit }) => {
  const [date, setDate] = useState(null); // dayjs object or null
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // Initialize empty, or with a default like CATEGORIES[0]

  useEffect(() => {
    if (editingTask) {
      // When editingTask is provided, populate form fields
      setDate(editingTask.date ? dayjs(editingTask.date) : null); // Convert incoming date string/Date to dayjs
      setCompany(editingTask.company || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || ''); // Use existing category or empty
    } else {
      // When not editing (i.e., adding a new task or after cancel/save of edit)
      // Reset form fields to their initial/default state
      setDate(null);
      setCompany('');
      setDescription('');
      setCategory(''); // Or a default like CATEGORIES[0] if you prefer
    }
  }, [editingTask]); // Re-run this effect if editingTask prop changes

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!date || !company || !description || !category) {
      alert('Please fill in all required fields (Date, Company, Description, Category).');
      return;
    }

    const taskData = {
      // Format date for backend: toISOString() is a common standard.
      // Your backend Mongoose schema expects a Date type, which can parse ISO strings.
      date: date ? date.toISOString() : null, // Send as ISO string or null
      company,
      description,
      category,
    };
    console.log('Task Data Submitted:', taskData);
    onSaveTask(taskData); // Pass the prepared data to App.jsx

    // Clear form only if we are NOT editing (i.e., we just added a new task)
    // If editing, App.jsx will set editingTask to null, and the useEffect above will clear the form.
    if (!editingTask) {
      setDate(null);
      setCompany('');
      setDescription('');
      setCategory('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 3,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
          boxShadow: 1,
          mb: 4,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {editingTask ? 'Edit Task' : 'Add New Task'} {/* Dynamic Title */}
        </Typography>

        <DatePicker
          label="Date *" // Indicate required
          value={date}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true, // HTML5 required
              variant: 'outlined',
              // helperText: 'Select a date for the task', // Optional
            },
          }}
        />

        <TextField
          label="Company *" // Indicate required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name"
          fullWidth
          required // HTML5 required
          variant="outlined"
        />

        <TextField
          label="Description *" // Indicate required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the task"
          multiline
          rows={3}
          fullWidth
          required // HTML5 required
          variant="outlined"
        />

        <FormControl fullWidth required variant="outlined">
          <InputLabel id="category-select-label">Category *</InputLabel>
          <Select
            labelId="category-select-label"
            id="category"
            value={category}
            label="Category *" // Match label for proper outlining
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Select Category --</em>
            </MenuItem>
            {/* Map over CATEGORIES array for consistency and maintainability */}
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 1 }}>
          <Button type="submit" variant="contained" color="primary">
            {editingTask ? 'Save Changes' : 'Add Task'} {/* Dynamic Button Text */}
          </Button>
          {editingTask && ( // Only show Cancel button if editing
            <Button
              type="button" // Important: not 'submit'
              variant="outlined"
              onClick={onCancelEdit} // Call the handler from App.jsx
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TaskForm;