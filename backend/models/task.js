// models/Task.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now // Default to current date/time if not provided
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true // Removes whitespace from start/end
    },
    description: {
        type: String,
        required: [true, 'Task description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: ['Meeting', 'Coding', 'Research', 'Documentation', 'Planning', 'Other'] // Example categories - customize as needed!
    },
    // Optional: Add status, priority, due date etc. later if needed
    // status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
    createdAt: { // Automatically track creation time
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema); // 'Task' will be the name of the collection (pluralized to 'tasks' in MongoDB)