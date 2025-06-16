

import express from "express"

import { getUserPosts, deletePost, createPost } from "../controllers/postController.js"
import { authenticate } from "../middleware/protectedAction.js"


const router = express.Router()

// router.get("/", authenticate, createPost)

// router.post('/', authenticate, (req, res, next) => {
//   console.log("🔥 createPost route hit");
//   next();
// }, createPost);

router.post('/', authenticate, createPost);

router.get("/", authenticate,  getUserPosts)
router.delete("/:id", authenticate, deletePost)

export default router