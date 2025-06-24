// taskTracker/frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import axios from "axios";
import Confetti from "react-confetti";


const theme = createTheme({
  palette: { primary: { main: "#007bff" }, secondary: { main: "#6c757d" } },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 500, marginBottom: "1rem" },
    h2: { fontSize: "2rem", fontWeight: 500, marginBottom: "0.75rem" },
    h5: { fontSize: "1.5rem", fontWeight: 500, marginBottom: "0.5rem" },
  },
});

const API_BASE_URL = "/api/tasks";
const ITEMS_PER_PAGE = 5;

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); 

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTasks = React.useCallback(async (pageToFetch) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", pageToFetch);
      params.append("limit", ITEMS_PER_PAGE);

      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      // console.log('fetchTasks: Backend response:', response.data);

      const fetchedTasks = response.data.tasks.map((task) => ({
        ...task,
        id: task._id,
      }));

      setTasks(fetchedTasks);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please ensure the backend is running.");
      setTasks([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, fetchTasks]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSaveTask = async (taskData) => {
    setLoading(true);
    setError(null);
    let taskSavedSuccessfully = false;

    if (editingTask) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/${editingTask.id}`,
          taskData
        );
        const updatedTaskFromBackend = response.data;
        const updatedTaskForState = {
          ...updatedTaskFromBackend,
          id: updatedTaskFromBackend._id,
        };
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? updatedTaskForState : task
          )
        );
        setEditingTask(null);
        console.log("Task updated:", updatedTaskForState);
        taskSavedSuccessfully = true;
      } catch (err) {
        console.error("Error updating task:", err.response ? err.response.data : err.message);
        if (err.response && err.response.data && err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).map((e) => e.message).join(", ");
          setError(`Validation Error: ${errorMessages}`);
        } else {
          setError(err.response?.data?.msg || "Failed to update task.");
        }
      }
    } else { 
      try {
        const response = await axios.post(API_BASE_URL, taskData);
        const newTaskFromBackend = response.data;
        const newTaskForState = {
          ...newTaskFromBackend,
          id: newTaskFromBackend._id,
        };
        setTasks((prevTasks) => [newTaskForState, ...prevTasks]); 
        console.log("New task added:", newTaskForState);
        taskSavedSuccessfully = true;
      } catch (err) {
        console.error("Error adding task:", err.response ? err.response.data : err.message);
        setError(err.response?.data?.msg || "Failed to add task.");
      }
    }

    if (taskSavedSuccessfully) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    setLoading(false);
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
      console.log("Task deleted, ID:", taskId);
      let pageToFetch = currentPage;
      if (tasks.length === 1 && currentPage > 1) { 
        pageToFetch = currentPage - 1;
      }
      await fetchTasks(pageToFetch);

    } catch (err) {
      console.error("Error deleting task:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || "Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showConfetti && (
        <Confetti
          recycle={false} 
          numberOfPieces={300}
          gravity={0.15}
        />
      )}
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom align="center">
            Internship Task Tracker
          </Typography>

          <TaskForm
            onSaveTask={handleSaveTask}
            editingTask={editingTask}
            onCancelEdit={handleCancelEdit} 
          />

          {error && <Typography color="error" sx={{my: 2, textAlign: 'center'}}>{error}</Typography>}

          <Typography variant="h2" component="h2" sx={{ mt: 5, mb: 2 }}>
            Tasks {totalItems > 0 && `(${totalItems})`}
          </Typography>

          {loading && tasks.length === 0 && <p>Loading tasks...</p>}

          <TaskList
            tasks={tasks}
            isLoading={loading && tasks.length > 0}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;