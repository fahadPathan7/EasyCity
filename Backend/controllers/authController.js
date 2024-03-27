// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const nodemailer = require("nodemailer");

// internal imports
const User = require("../models/User");
const UserDocument = require("../models/UserDocument");

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
};

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
};

const resetPasswordInitiate = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      // send email with code

      // generate a random code
      const code = Math.floor(100000 + Math.random() * 900000);

      // send email
      try {
        // reset password request. send code via email.
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_ID,
          to: req.body.email,
          subject: "Reset password request",
          text: "Your reset password code is: " + code + ".",
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);

        // save code in user document
        const userDocument = new UserDocument({
          code: code,
          email: req.body.email,
        });
        await userDocument.save();

        res.status(200).json({
          message: "Code sent to the email.",
        });
      } catch (error) {
        console.log("error: ", error);
        next(createError(500, "Email can not be sent!"));
      }
    } else {
      next(createError(404, "User not found."));
    }
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
};

// reset password confirm. check code and update password.
const resetPasswordConfirm = async (req, res, next) => {
  try {
    const userDocument = await UserDocument.findOne({
      code: req.body.code,
      email: req.body.email,
    });

    if (userDocument) {
      const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);

      const user = await User.findOne({
        email: req.body.email,
      });

      user.password = hashedPassword;
      await user.save();

      await userDocument.deleteOne();

      res.status(200).json({
        message: "Password updated successfully.",
      });
    } else {
      next(createError(404, "Code not found."));
    }
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
};

// change password of logged in user
const changePassword = async (req, res, next) => {
  try {
    //console.log("req.user: ", req.user);
    const user = await User.findOne({
      userID: req.user.userID,
    });

    if (user) {
      // check if the new password is less than 6 characters
      if (req.body.newPassword.length < 6) {
        next(createError(400, "Password must be at least 6 characters long."));
      }

      const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password updated successfully.",
      });
    } else {
      next(createError(404, "User not found."));
    }
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
};

// validate token.
const validateToken = async (req, res, next) => {
  try {
    const token = req.signedCookies[process.env.COOKIE_NAME];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          next(createError(401, "Unauthorized."));
        } else {
          res.locals.loggedInUser = user;
          res.status(200).json({
            message: "Token is valid.",
            user: user,
          });
        }
      });
    } else {
      next(createError(401, "Unauthorized."));
    }
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
};

// export
module.exports = {
  login,
  register,
  logout,
  resetPasswordInitiate,
  resetPasswordConfirm,
  changePassword,
  validateToken,
};
