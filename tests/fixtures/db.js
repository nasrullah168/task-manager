const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Nasrullah',
    email: 'nasrullah@eg.com',
    password: 'breed123!',
    tokens: [{
        token: jwt.sign({ _id:userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Noorul',
    email: 'noorul@eg.com',
    password: 'breeds123!',
    tokens: [{
        token: jwt.sign({ _id:userOneId }, process.env.JWT_SECRET)
    }]
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: 'Second jest task',
    completed: false,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId,
    description: 'Third jest task',
    completed: false,
    owner: userTwoId
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: 'First jest task',
    completed: false,
    owner: userOneId
}

const setUpDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase
}