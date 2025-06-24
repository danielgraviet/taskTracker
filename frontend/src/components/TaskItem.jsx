// taskTracker/frontend/src/components/TaskItem.jsx

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskItem = ({ task, onEdit, onDelete }) => {
  // Helper to format date if it's just YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString != 'string') return 'N/A';
    const dateParts = dateString.split("-");
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // JS months are 0-indexed
      const day = parseInt(dateParts[2], 10);
  
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const dateObj = new Date(year, month, day); // This creates a date in the local timezone
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }
  }};


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