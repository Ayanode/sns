import User  from '../models/userModel.js';
import bcrypt from 'bcrypt';
import {createToken}  from '../middlewares/auth.js';

// Register User 
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, dob, password, confirmPassword, isAdmin } = req.body;

    // Validate request data
    if (!firstName || !lastName || !username || !email || !dob || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data!',
      });
    }

    // Check if password is at least 6 characters long
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password does not match!',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long!',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      dob,
      password: hashedPassword,
      isAdmin: isAdmin || false // Default to false if not provided
    });

    // Generate a token
    const token = createToken(user._id, user.email);

    // Return response with user data and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        dob: user.dob,
        isAdmin: user.isAdmin
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
};

// Login User 
export const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Validate request data
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data',
      });
    }

    // Check if password is at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if username or email exists
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
      });
    }

    if (user.isFirebaseAuth) {
      return res.status(400).json({
        success: false,
        message: 'Wrong credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Wrong credentials',
      });
    }

    // Generate a token
    const token = createToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (err) {
    return next(err);
  }
};

// Google and Facebook Auth through Firebase
export const firebaseAuth = async (req, res, next) => {
  try {
    const { email, name } = req.user;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        isFirebaseAuth: true,
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1]
      });
    }

    const token = createToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      token,
    });
  } catch (err) {
    return next(err);
  }
};

// Auth Verify
export const verify = async (req, res, next) => {
  try {
    const user = req.user;

    if (user) {
      return res.status(200).json({
        success: true,
        isLogin: true
      });
    }
    if (!user) {
      return res.status(200).json({
        success: true,
        isLogin: false
      });
    }
  } catch (err) {
    return next(err);
  }
};

// Get Logged In User
export const getUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return next(err);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, dob } = req.body;

    if (!firstName || !lastName || !username || !email || !dob) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    const user = await User.findById(req.user._id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the username is already taken by another user
    const usernameExists = await User.findOne({
      username, _id: { $ne: user._id },
    });

    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Check if the email is already taken by another user
    const emailExists = await User.findOne({
      email, _id: { $ne: user._id },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken",
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.dob = dob;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      updatedUser,
    });
  } catch (err) {
    return next(err);
  }
};

// Get All Users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    return next(err);
  }
};
