const express = require('express');
require('./db/mongoose');
const userRoute = require('./routers/user');
const taskRoute = require('./routers/task');

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(userRoute); // registering user router
app.use(taskRoute); // registering task router

app.listen(port, () => {
    console.log('Server is up on port '+port);
});