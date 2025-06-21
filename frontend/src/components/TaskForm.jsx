// taskTracker/frontend/src/components/TaskForm.jsx

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
// For a better Date Picker experience, you'd typically install and use:
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // or AdapterDateFns
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// For now, we'll use TextField type="date" for simplicity.

const TaskForm = ({ onSaveTask, editingTask, onCancelEdit }) => {
  // State for each form field
  const [date, setDate] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  // We'll add taskId and useEffect for editing later

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission (page reload)
    const taskData = {
      // id will be handled later (either new or existing)
      date,
      company,
      description,
      category,
    };
    console.log('Task Data Submitted:', taskData); 
    onSaveTask(taskData); 

    setDate('');
    setCompany('');
    setDescription('');
    setCategory('');
  };

  return (
    <Box
      component="form" // Renders a <form> tag
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Spacing between form elements (theme.spacing(2))
        padding: 3,
        border: '1px solid',
        borderColor: 'grey.300', // Using theme's color palette
        borderRadius: 2, // theme.shape.borderRadius * 2
        boxShadow: 1, // theme.shadows[1]
        mb: 4, // Margin bottom
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {/* We'll handle 'Add Task' / 'Edit Task' text later */}
        Add Task
      </Typography>

      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }} // Ensures label doesn't overlap with date input
        fullWidth
        required
        variant="outlined" // Default, but good to be explicit
      />

      <TextField
        label="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company Name"
        fullWidth
        required
        variant="outlined"
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the task"
        multiline
        rows={3}
        fullWidth
        required
        variant="outlined"
      />

      <FormControl fullWidth required variant="outlined">
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category"
          value={category}
          label="Category" // Important for outlined variant label positioning
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="">
            <em>-- Select Category --</em>
          </MenuItem>
          <MenuItem value="SEO">SEO</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="Data Analysis">Data Analysis</MenuItem>
          <MenuItem value="Frontend">Frontend</MenuItem>
          <MenuItem value="Writing">Writing</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 1 }}>
        <Button type="submit" variant="contained" color="primary">
          {/* 'Save Task' / 'Update Task' text later */}
          Save Task
        </Button>
        {/* 'Cancel Edit' button will be added later */}
      </Box>
    </Box>
  );
};

export default TaskForm;