

import express from "express";
import { 
    login,
    register,
    changePassword,
    requestPasswordReset,
    resetPassword,
    deleteAccount, 
    uploadProfileImage
    } from "../controllers/userController.js";

import upload from "../middleware/upload.js";

import { authenticate } from "../middleware/protectedAction.js";

const router =  express.Router()


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request or email already exists
 */

router.post("/register", register)





/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */

router.post("/login", login)


/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: If email exists, reset link sent
 */

router.post("/forgot-password", requestPasswordReset)

/**
 * @swagger
 * /api/user/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */

router.post("/reset-password/:token", resetPassword)



/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change current password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Incorrect old password
 */

router.put("/change-password", authenticate, changePassword)

/**
 * @swagger
 * /api/user/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 */

router.delete("/delete-account", authenticate, deleteAccount)


/**
 * @swagger
 * /api/user/upload-profile-picture:
 *   put:
 *     summary: Upload or change profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated
 *       400:
 *         description: No image uploaded
 *       401:
 *         description: Unauthorized
 */

router.put("/upload-profile-picture", authenticate, upload.single("image"), uploadProfileImage)



export default router  
