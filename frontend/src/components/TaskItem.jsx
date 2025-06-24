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
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A';
    const dateParts = dateString.split("-");
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);

      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const dateObj = new Date(year, month, day);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }
    }
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };


  return (
    <Card sx={{
      width: '100%',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'flex-start' }
    }}>
      <CardContent sx={{
        flexGrow: 1,
        pb: { xs: 0, sm: '16px' },
        width: { xs: '100%', sm: 'auto' }
      }}>
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
      <CardActions sx={{
        alignSelf: { xs: 'flex-end', sm: 'center' },
        pr: { sm: 2 },
        pt: { xs: 1, sm: '16px'},
        pb: { xs: 1, sm: 0 }
      }}>
        <IconButton
          aria-label="edit task"
          onClick={() => onEdit(task)}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete task"
          onClick={() => onDelete(task.id)}
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