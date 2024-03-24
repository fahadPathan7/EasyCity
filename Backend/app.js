// app.js

// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

// internal imports
const authRouter = require('./routers/authRouter');
const { errorHandler } = require('./middlewares/common/errorHandler');

// app initialization
const app = express();

// dotenv configuration
dotenv.config();

// database connection
mongoose.connect('mongodb+srv://' + process.env.USER + ':' + process.env.PASSWORD + '@cluster0.oxoqi6z.mongodb.net/' + process.env.APP_Name + '?retryWrites=true&w=majority')
.then(() => {
    console.log('database connected.');
}).catch((error) => {
    console.log('error: ', error);
});

// request body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable credentials (cookies, authorization headers)
}));

// routes
app.use('/auth', authRouter);

// error handler
app.use(errorHandler);
app.options('*', cors());

// listen to the port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
