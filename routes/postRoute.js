

import express from "express"

import { getUserPosts, deletePost, createPost, updatePost, getSinglePost } from "../controllers/postController.js"
import { authenticate } from "../middleware/protectedAction.js"


const router = express.Router()


/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts for the logged-in user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   body:
 *                     type: string
 *                   userId:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized – No or invalid token
 *       500:
 *         description: Server error
 */

router.get("/", authenticate,  getUserPosts)


/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subject
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */

router.post('/', authenticate, createPost);



/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – not the owner
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authenticate, deletePost);



router.put("/posts/:id", authenticate, updatePost);

router.get("/posts/:id", authenticate, getSinglePost);


export default router
