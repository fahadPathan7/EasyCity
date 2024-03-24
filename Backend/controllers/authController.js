// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/User");

// user login
async function login(req, res) {
  try {
    // check if user exists
    const user = await User.findOne({
        $or: [{ email: req.body.username }, { mobile: req.body.username }],
        // here username can be either email or mobile number
    });

    if (user) {
      const isValidPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        const userObject = {
          userID: user.userID,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          roleID: user.roleID,
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: "72h",
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: 72 * 60 * 60 * 1000,
          httpOnly: true,
        });

        // set logged in user
        res.locals.loggedInUser = userObject;

        // send response
        res.status(200).json({
          message: "Login successful.",
          user: userObject,
        });
      } else {
        createError(400, "Invalid credentials.");
      }
    } else {
        createError(404, "User not found.");
    }
  } catch (error) {
    createError(500, "Internal server error.");
  }
}

// create new user
async function register(req, res) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const newUser = new User({
      userID: "U" + Date.now(),
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword,
      roleID: 2,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error.",
    });
  }
}

// logout
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);

  res.status(200).json({
    message: "Logout successful.",
  });
}

// export
module.exports = {
  login,
  register,
  logout,
};
