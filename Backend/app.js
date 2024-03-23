// external imports
const express = require('express');

// run the server
const app = express();

// set the port
const port = 3000;

// set the route
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

// listen to the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);