// taskTracker/frontend/src/components/TaskItem.jsx

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box'; // For layout if needed
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskItem = ({ task, onEdit, onDelete }) => {
  // Helper to format date if it's just YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Assuming dateString is 'YYYY-MM-DD'
    // For more robust parsing, consider a library like date-fns or dayjs
    try {
        const dateObj = new Date(dateString + 'T00:00:00'); // Ensure it's treated as local date
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        return dateObj.toLocaleDateString(undefined, { // undefined for user's locale
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (e) {
        return dateString; // Fallback if parsing fails
    }
  };


  return (
    <Card sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <CardContent sx={{ flexGrow: 1, pb: { xs: 0, sm: '16px' } /* Adjust padding for actions */ }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {formatDate(task.date)}
        </Typography>
        <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
          {task.company || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Category: {task.category || 'N/A'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {task.description || 'No description'}
        </Typography>
      </CardContent>
      <CardActions sx={{ alignSelf: { xs: 'flex-end', sm: 'center' }, pr: { sm: 2 }, pt: { xs: 0, sm: '16px'} }}>
        <IconButton
          aria-label="edit task"
          onClick={() => onEdit(task)} // Pass the whole task object up
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete task"
          onClick={() => onDelete(task.id)} // Pass just the ID up
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskItem;