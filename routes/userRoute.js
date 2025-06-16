

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

router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", requestPasswordReset)
router.post("/reset-password/:token", resetPassword)

router.put("/change-password", authenticate, changePassword)
router.delete("/delete-account", authenticate, deleteAccount)
router.put("/upload-profile-picture", authenticate, upload.single("image"), uploadProfileImage)



export default router  
