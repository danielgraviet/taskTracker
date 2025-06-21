// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/task'); // Import the Task model

// --- CRUD Operations ---

// CREATE: Add a new task (POST /api/tasks)
router.post('/', async (req, res) => {
    const { date, company, description, category } = req.body;
    if (!company || !description || !category) {
        return res.status(400).json({ msg: 'Please include company, description, and category' });
    }

    try {
        const newTask = new Task({
            date: date || Date.now(), // Use provided date or default to now
            company,
            description,
            category
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask); // 201 Created status
    } catch (err) {
        console.error("Error creating task:", err.message);
        // Check for validation errors specifically
        if (err.name === 'ValidationError') {
             return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
        }
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const {
            search,
            sortBy,
            order,
            category: categoryFilter,
            company: companyFilter,
            page: pageQuery, // gets page and limit from query
            limit: limitQuery
        } = req.query;

        const page = parseInt(pageQuery) || 1;
        const limit = parseInt(limitQuery) || 10;
        const skip = (page - 1) * limit; // figure out what this is. 

        let query = {}; // Mongoose query object
        let sortOptions = {}; // Mongoose sort options

        // Search Logic (simple case-insensitive search across key fields)
        if (search) {
             const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive
             query.$or = [ // Search in multiple fields
                 { company: searchRegex },
                 { description: searchRegex },
                 { category: searchRegex }
             ];
        }

         // Filtering Logic
        if (categoryFilter) {
            query.category = categoryFilter; // Exact match filter
        }
        if (companyFilter) {
             query.company = companyFilter; // Can make this case-insensitive too if needed
        }


        // Sorting Logic
        if (sortBy) {
            sortOptions[sortBy] = (order === 'desc' || order === -1) ? -1 : 1; // -1 for descending, 1 for ascending
        } else {
             sortOptions.date = -1; // Default sort by date descending
        }

        const [tasks, totalItems] = await Promise.all([
            Task.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .exec(),
            Task.countDocuments(query).exec()
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            tasks,
            currentPage: page,
            totalPages,
            totalItems,
        });
    } catch (err) {
        console.error("Error fetching tasks:", err.message);
        res.status(500).send('Server Error');
    }
});

// READ: Get a single task by ID (GET /api/tasks/:id)
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        console.error("Error fetching task by ID:", err.message);
         if (err.kind === 'ObjectId') { // Handle invalid ID format
            return res.status(400).json({ msg: 'Invalid Task ID format' });
         }
        res.status(500).send('Server Error');
    }
});

// UPDATE: Modify an existing task (PUT /api/tasks/:id)
router.put('/:id', async (req, res) => {
    const { date, company, description, category } = req.body;
    // Build task object based on fields provided in request
    const taskFields = {};
    if (date) taskFields.date = date;
    if (company) taskFields.company = company;
    if (description) taskFields.description = description;
    if (category) taskFields.category = category;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields }, // Update only the fields provided
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json(task);
    } catch (err) {
        console.error("Error updating task:", err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Task ID format' });
        }
         if (err.name === 'ValidationError') {
             return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
        }
        res.status(500).send('Server Error');
    }
});

// DELETE: Remove a task (DELETE /api/tasks/:id)
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

        res.json({ msg: 'Task removed successfully' });
    } catch (err) {
        console.error("Error deleting task:", err.message);
         if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Task ID format' });
         }
        res.status(500).send('Server Error');
    }
});

module.exports = router;