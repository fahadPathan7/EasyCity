// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/User");

// user login
const login = async (req, res, next) => {
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
          roleIDs: user.roleIDs,
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: "72h",
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: 72 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
          signed: true,
          sameSite: 'none',
        });

        // set logged in user
        res.locals.loggedInUser = userObject;

        // send response
        res.status(200).json({
          message: "Login successful.",
          user: userObject,
        });
      } else {
        next(createError(400, "Invalid credentials."));
      }
    } else {
        next(createError(404, "User not found."));
    }
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
}

// create new user
const register = async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    let roles = req.body.roleIDs;
    if (roles.length === 0) {
      roles = [4]; // default role ID
    }

    const newUser = new User({
      userID: "U" + Date.now(),
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword,
      profileImage: "",
      coverImage: "",
      roleIDs: roles,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
    });
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
};

// logout
const logout = (req, res) => {
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
