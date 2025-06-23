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
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

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

const API_BASE_URL = "/api/tasks"

function App() {
  const [tasks, setTasks] = useState([]); // State to hold the list of tasks
  const [editingTask, setEditingTask] = useState(null); // For edit functionality later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE_URL);
        const fetchedTasks = response.data.tasks.map(task => ({
          ...task,
          id: task._id // Map MongoDB _id to id
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

  console.log("tasks: ", tasks);

  // --- Mock data loading and saving to localStorage (for persistence across reloads) ---
  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]); // Runs whenever 'tasks' changes
  // --- End localStorage mock ---

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Logic for updating an existing task (we'll implement this later)
      console.log("Updating task:", taskData);
      // setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
      // setEditingTask(null);
    } else {
      // Logic for adding a new task
      const newTask = { ...taskData, id: uuidv4() }; // Add a unique ID
      setTasks((prevTasks) => [newTask, ...prevTasks]); // Add to the beginning of the list
      console.log("New task added:", newTask);
    }
  };

  const handleEditTask = (task) => {
    console.log("Editing task in App:", task);
    // setEditingTask(task);
    // We'll populate the form with this task's data later
  };

  const handleDeleteTask = (taskId) => {
    console.log("Deleting task in App, ID:", taskId);
    // setTasks(tasks.filter(task => task.id !== taskId));
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
            // editingTask={editingTask} // Pass editingTask later
            // onCancelEdit={() => setEditingTask(null)} // Pass cancel later
          />

          <Typography variant="h2" component="h2" sx={{ mt: 5, mb: 2 }}>
            Tasks
          </Typography>
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask} // Pass the handler
            onDeleteTask={handleDeleteTask} // Pass the handler
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
