// taskTracker/frontend/src/components/TaskList.jsx

import React from 'react';
import Box from '@mui/material/Box';
import TaskItem from './TaskItem'; // Import the TaskItem component
import Typography from '@mui/material/Typography';

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
        No tasks yet. Add one using the form above!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}> {/* Add some margin top */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id} // Crucial for React's list rendering performance
          task={task}
          onEdit={onEditTask}     // Pass down the onEditTask function
          onDelete={onDeleteTask} // Pass down the onDeleteTask function
        />
      ))}
    </Box>
  );
};

export default TaskList;