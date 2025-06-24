// taskTracker/frontend/src/components/TaskList.jsx

import React from "react";
import Box from "@mui/material/Box";
import TaskItem from "./TaskItem"; // Import the TaskItem component
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";

const TaskList = ({
  tasks,
  onEditTask,
  onCancelEdit,
  onDeleteTask,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Typography
        variant="subtitle1"
        sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
      >
        No tasks yet. Add one using the form above!
      </Typography>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mt: 1, flexDirection: "column"}}>
        {tasks.map((task) => (
          <Grid item xs={12} key={task.id} >
            <TaskItem
              task={task}
              onEdit={onEditTask} // No need to pass whole task, App.jsx's handleEditTask expects the task
              onDelete={onDeleteTask} // App.jsx's handleDeleteTask expects taskId
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default TaskList;
