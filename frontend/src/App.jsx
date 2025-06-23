// taskTracker/frontend/src/App.jsx

import React, { useState, useEffect } from "react"; // Added useState and useEffect
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import axios from "axios";

const theme = createTheme({
  // ... (your theme definition)
  palette: { primary: { main: "#007bff" }, secondary: { main: "#6c757d" } },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 500, marginBottom: "1rem" },
    h2: { fontSize: "2rem", fontWeight: 500, marginBottom: "0.75rem" },
    h5: { fontSize: "1.5rem", fontWeight: 500, marginBottom: "0.5rem" },
  },
});

const API_BASE_URL = "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]); // State to hold the list of tasks
  const [editingTask, setEditingTask] = useState(null); // For edit functionality later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE_URL);
        const fetchedTasks = response.data.tasks.map((task) => ({
          ...task,
          id: task._id, // Map MongoDB _id to id
        }));
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []); // Empty dependency array: runs once on mount

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      try {
        // 'editingTask.id' is the MongoDB '_id'
        const response = await axios.put(`${API_BASE_URL}/${editingTask.id}`, taskData);
        const updatedTaskFromBackend = response.data;
        const updatedTaskForState = {
          ...updatedTaskFromBackend,
          id: updatedTaskFromBackend._id
        };

        setTasks(tasks.map(task =>
          task.id === editingTask.id ? updatedTaskForState : task
        ));
        setEditingTask(null); 
        console.log("Task updated:", updatedTaskForState);
      } catch (err) {
        console.error("Error updating task:", err.response ? err.response.data : err.message);
        if (err.response && err.response.data && err.response.data.errors) {
            const errorMessages = Object.values(err.response.data.errors).map(e => e.message).join(', ');
            setError(`Validation Error: ${errorMessages}`);
        } else {
            setError(err.response?.data?.msg || "Failed to update task.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(API_BASE_URL, taskData);
        const newTaskFromBackend = response.data;
        const newTaskForState = {
          ...newTaskFromBackend,
          id: newTaskFromBackend._id,
        };
        setTasks((prevTasks) => [newTaskForState, ...prevTasks]);
        console.log("New task added:", newTaskForState);
      } catch (err) {
        console.error(
          "Error adding task:",
          err.response ? err.response.data : err.message
        );
        setError(err.response?.data?.msg || "Failed to add task.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditTask = (task) => {
    console.log("Editing task in App:", task);
    setError(null);
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setError(null); 
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      console.log("Task deleted, ID:", taskId);
    } catch (err) {
      console.error(
        "Error deleting task:",
        err.response ? err.response.data : err.message
      );
      setError(err.response?.data?.msg || "Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom align="center">
            Internship Task Tracker
          </Typography>

          <TaskForm
            onSaveTask={handleSaveTask}
            editingTask={editingTask} // Pass editingTask later
            onCancelEdit={() => setEditingTask(null)} // Pass cancel later
          />

          <Typography variant="h2" component="h2" sx={{ mt: 5, mb: 2 }}>
            Tasks
          </Typography>
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onCancelEdit={handleCancelEdit}
            onDeleteTask={handleDeleteTask} 
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
