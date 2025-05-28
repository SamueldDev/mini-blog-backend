
// // imports
// import express from "express"
// import dotenv from "dotenv"
// import path from "path"
// import slugify from "slugify"
// import fs from "fs"
// import { fileURLToPath} from "url"
// import { v4 as uuidv4 } from 'uuid';
// import cors from "cors"

// dotenv.config()

// const PORT = process.env.PORT || 3000;

// // get filename and directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const POSTS_DIR = path.join(__dirname, "posts");

// // express app initialization
// const app = express()

// // middleware to parse JSON data
// app.use(express.json())

// // // serve public file
// // app.use(express.static('public'))

// // allow cors
// app.use(cors());


// // post blog
// app.post("/posts", (req, res) => {
    
//     const { author, title, content } = req.body // extract json data

//     // simple validation
//     if(!title || !author || !content){
//         return res.status(400).json({
//             message: "Title, author and content are required"
//         })
//     }

//     // generate filename
//     const slug = slugify(title, {lower: true, strict: true});
//     const timestamp = Date.now()
//     // const filename = `${slug}-${timestamp}.json`
//     const id = uuidv4();
//     const filePath = path.join(POSTS_DIR, `${id}.json`);

//     //const filePath = path.join(__dirname, "posts", `${id}.json`)
  

//     // create blog post object
//     const post = {
//         id,
//         title, 
//         author,
//         content,
//         slug: `${slug}-${timestamp}`,
//         createdAt: new Date().toISOString(),
        
//         // date: new Date().toISOString
//     }


//     // write to a file
//     fs.writeFile(filePath, JSON.stringify(post, null, 2), (err) => {
//         if(err){
//             console.error("Error saving file:", err.message)
//             return res.status(500).json({ message: "falied to save blog post"})
//         }
//         res.status(201).json({ message: "Blog post saved.", id})
//     })

// })


// // get all posts

// app.get("/posts", (req, res) => {
//     fs.readdir(POSTS_DIR, (err, files) => {
//         if(err){
//             console.error("failed to read post directory:", err.message)
//         }

//         // read only json files
//         const jsonFiles = files.filter(file => file.endsWith(".json"));


//         // push all post to a new array
//          const posts = [];

//         // read and parse each post file
//         jsonFiles.forEach(file => {
//             const filePath = path.join(POSTS_DIR, file);
//             const data = fs.readFileSync(filePath, "utf-8")
            
//         try{
//             const post = JSON.parse(data);
//             posts.push({
//                 id: post.id,
//                 title: post.title,
//                 author: post.author,
//                 content: post.content,
//                 slug: post.slug,
//                 createdAt: post.createdAt
               
//             })
//         } catch(err){
//             console.error(`failed to parse ${file}`)
//         }

//         })
//            res.json(posts)

//     })
// })

// app.get("/posts/:id", (req, res) => {
//     const { id } = req.params
//     const filePath = path.join(POSTS_DIR, `${id}.json`)

//     fs.readFile(filePath, "utf-8", (err, data) => {
//         if(err){
//             return res.status(404).json({ message : "Post not found"})
//         }

//         try{
//             const post = JSON.parse(data);
//             res.json(post)
//         } catch{
//             res.status(500).json({message: "failed to parse post"})
//         }
//     })
// })


// app.delete("/posts/:id", (req, res) => {
//     const { id } = req.params
//     const filepath = path.join(POSTS_DIR, `${id}.json`); 
//     fs.unlink(filepath, (err) => {
//         if(err) return res.status(404).json({ message : "post not found or already deleted"});
//         res.json({ message: "Post deleted successfully"});

//     })
// })

// // listen to the port
// app.listen(PORT, () => {
//     console.log(`server running at port:${PORT}`) 
// })









































// db.js
// server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { pool } from "./db.js";


// Setup .env and dirs
dotenv.config();
const PORT = process.env.PORT || 7030;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Express app
const app = express();
app.use(cors());
app.use(express.json()); 

// Create a new post
// app.post("/posts", async (req, res) => {
//   const { title, author, content } = req.body;

//   if (!title || !author || !content) {
//     return res.status(400).json({ message: "Title, author, and content are required" });
//   }

//   const newPost = {
//     id: uuidv4(),
//     title,
//     author,
//     content,
//     createdAt: new Date().toISOString(),
//   };

//   db.data.posts.push(newPost);
//   await db.write();

//   res.status(201).json({ message: "Post created", id: newPost.id });
// });


app.post("/posts", async (req, res) => {
  const { title, author, content } = req.body;

  if (!title || !author || !content) {
    return res.status(400).json({ message: "Title, author, and content are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (title, author, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id`,
      [title, author, content]
    );
    res.status(201).json({ message: "Post created", id: result.rows[0].id });
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// // Get all posts

// app.get("/posts", async (req, res) => {
//   await db.read();
//   res.json(db.data.posts);
// });


app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





// Get post by ID
// app.get("/posts/:id", async (req, res) => {
//   await db.read();
//   const post = db.data.posts.find((p) => p.id === req.params.id);

//   if (!post) {
//     return res.status(404).json({ message: "Post not found" });
//   }

//   res.json(post);
// });

app.get("/posts/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




// Delete post by ID
// app.delete("/posts/:id", async (req, res) => {
//   await db.read();
//   const index = db.data.posts.findIndex((p) => p.id === req.params.id);

//   if (index === -1) {
//     return res.status(404).json({ message: "Post not found or already deleted" });
//   }

//   db.data.posts.splice(index, 1);
//   await db.write();

//   res.json({ message: "Post deleted successfully" });
// });


app.delete("/posts/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post not found or already deleted" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

