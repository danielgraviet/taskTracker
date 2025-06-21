import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';


import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const TaskForm = ({ onSaveTask, editingTask, onCancelEdit }) => {
  // State for each form field
  const [date, setDate] = useState(null);
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  // We'll add taskId and useEffect for editing later

  useEffect(() => {
    if (editingTask) {
      setDate(editingTask.date ? dayjs(editingTask.date) : null); // THIS LINE IS CRITICAL
      setCompany(editingTask.company || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || '');
    } else {
      setDate(null);
    }
  },[editingTask])

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

    setDate(null);
    setCompany('');
    setDescription('');
    setCategory('');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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

        <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
            }}
            slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  variant: 'outlined',
                  helperText: 'Select a date for the task', // Optional helper text
                },
              }}
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
    </LocalizationProvider>
  );
};

export default TaskForm;