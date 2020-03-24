const express = require('express');
require('./db/mongoose');
const userRoute = require('./routers/user');
const taskRoute = require('./routers/task');

const app = express();

app.use(express.json());
app.use(userRoute); // registering user router
app.use(taskRoute); // registering task router

module.exports = app;