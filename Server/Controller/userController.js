import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const genrateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ============================================
// 🔹 API: Register New User
// ============================================
// Route: POST /api/user/register

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = genrateToken(newUser._id);

    newUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: newUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================================
// 🔹 API: Login User
// ============================================
// Route: POST /api/user/login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({success: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false,message: "No User  Exist with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({success: false, message: "Invalid Credentials" });
    }

    const token = genrateToken(user._id);

    user.password = undefined;

  return res.status(200).json({
  success: true,
  message: "User login successfully",
  token,
  user,
});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
