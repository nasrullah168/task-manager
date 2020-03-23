const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send();
    }
});

// Get /tasks?completed=true
// Get /tasks?limit=10&skip=0
// Get /tasks?sortBy=createdAt:desc
// 1=asc & -1=desc
router.get('/tasks', auth, async (req, res) => {

    const match = {};
    const sort = {};

    if (req.query.completed) {

        match.completed = req.query.completed === 'true';

    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id }); //first approach

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate(); // second approach

        if ( ! req.user.tasks) {
            return res.status(404).send();
        }
        res.status(200).send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if ( ! task) {
            return res.status(404).send();
        }

        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];

    const isValidated = updates.every(update => {
        return allowedUpdates.includes(update);
    });

    if ( ! isValidated) {
        return res.status(400).send({ 'error': 'Invalid update!'});
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true});
        
        if ( ! task) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            return task[update] = req.body[update];
        });

        await task.save();

        res.status(200).send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findByIdAndDelete(_id);

        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if ( ! task) {
            return res.status(404).send();
        }

        res.status(200).send(task);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;