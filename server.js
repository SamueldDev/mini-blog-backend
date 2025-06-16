

// import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import cors from "cors";
// // import { v4 as uuidv4 } from "uuid";
// import { fileURLToPath } from "url";
// import { pool } from "./db.js";

// // Setup .env and dirs
// dotenv.config();
// const PORT = process.env.PORT || 7030;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Express app
// const app = express();
// app.use(cors());
// app.use(express.json()); 

// // make a post
// app.post("/posts", async (req, res) => {
   
//   const { title, author, content } = req.body;

//   if (!title || !author || !content) {
//     return res.status(400).json({ message: "Title, author, and content are required" });
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO posts (title, author, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id`,
//       [title, author, content]
//     );
//      console.log("✅ New post added:", result.rows[0]);

//     res.status(201).json({ message: "Post created", id: result.rows[0].id });
//   } catch (error) {
//     console.error("Error inserting post:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // get all posts
// app.get("/posts", async (req, res) => { 
//   try {
//     const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// // get post by id
// app.get("/posts/:id", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error fetching post:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// // delete a post by id
// app.delete("/posts/:id", async (req, res) => {
//   try {
//     const result = await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: "Post not found or already deleted" });
//     }
//     res.json({ message: "Post deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting post:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


























































import express from "express"
import cors from "cors"
import sequelize from "./config/db.js"
import dotenv from "dotenv"
dotenv.config()
import userRoute  from "./routes/userRoute.js"
import postRoute from "./routes/postRoute.js"

const PORT = process.env.PORT || 5000;


const app = express()

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
  res.send("mini_blog API is Live")
})

app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)  


const start = async () => {
    try{

      await sequelize.authenticate()
      console.log('DB connnected')

      await sequelize.sync({ alter: true})
      console.log("database synced ")

      //  await sequelize.sync({ force: true})
      // console.log("tabeles dropped and recreated ")

      app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
      })

    }catch(err){  
        console.error("Unable to connect to database:", err)
    }
}


start()














