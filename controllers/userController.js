

import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import { Op } from "sequelize";
import { sendResetEmail } from "../utils/sendEmail.js";
import cloudinary from "../config/cloudinary.js";


// import streamifer from "streamifier"

import streamifier from 'streamifier';



const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


// register a user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user);
    res.status(201).json({
        message: "user registered successfully",
        user: { id: user.id, name, email }, 
        token 
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


// log a user in
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ 
         message: "login successful",
        user: { id: user.id, name: user.name, email, profileImage: user.profileImage || null  },
        token
         });

  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};




// Change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required." });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ message: "Password changed successfully." });

  } catch (err) {
    res.status(500).json({ message: "Password change failed", error: err.message });
  }
};



//request password reset

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    // For security, always return 200
    if (!user) {
      return res.json({ message: "If that email is registered, check your inbox." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    user.resetToken = token;
    user.resetTokenExpires = expires;
    await user.save();

    sendResetEmail(user.email, token);

    res.json({ 
        message: "Reset link sent if email is valid. Also check your spam box as the case may be",
        token
    });

  } catch (err) {
    res.status(500).json({ message: "Reset request failed", error: err.message });
  }
};



// reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: new Date() } // token not expired
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    res.json({ message: "Password has been reset." });

  } catch (err) {
    res.status(500).json({ message: "Reset failed", error: err.message });
  }
};




//delete account

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete account",
      error: err.message
    });
  }
};




// upload picture
export const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'mini_blog_profiles',
            public_id: `user_${user.id}`,
            overwrite: true,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    user.profileImage = result.secure_url;
    await user.save();

    res.json({
      message: "Profile image updated",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      message: "Failed to upload image",
      error: err.message,
    });
  }
};
