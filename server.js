
// imports
import express from "express"
import dotenv from "dotenv"
import path from "path"
import slugify from "slugify"
import fs from "fs"
import { fileURLToPath} from "url"

dotenv.config()

const PORT = process.env.PORT || 3000;

// get filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express app initialization
const app = express()

// middleware to parse JSON data
app.use(express.json())


// post blog
app.post("/posts", (req, res) => {
    
    const { author, title, content } = req.body // extract json data

    // simple validation
    if(!title || !author || !content){
        return res.status(400).json({
            message: "Title, author and content are required"
        })
    }

    // generate filename
    const slug = slugify(title, {lower: true, strict: true});
    const timestamp = Date.now()
    const filename = `${slug}-${timestamp}.json`
    const filePath = path.join(__dirname, "posts", filename)

    // create blog post object
    const post = {
        title, 
        author,
        content,
        date: new Date().toISOString
    }


    // write to a file
    fs.writeFile(filePath, JSON.stringify(post, null, 2), (err) => {
        if(err){
            console.error("Error saving file:", err.message)
            return res.status(500).json({ message: "falied to save blog post"})
        }
        res.status(201).json({ message: "Blog post saved.", filename})
    })

})


// get all posts

const POSTS_DIR = path.join(__dirname, "posts")

app.get("/posts", (req, res) => {
    fs.readdir(POSTS_DIR, (err, files) => {
        if(err){
            console.error("failed to read post directory:", err.message)
        }

        // read only json files
        const jsonFiles = files.filter(file => file.endsWith(".json"));


        // push all post to a new array
         const posts = [];

        // read and parse each post file
        
        jsonFiles.forEach(file => {
            const filePath = path.join(POSTS_DIR, file);
            const data = fs.readFileSync(filePath, "utf-8")
            
       

        try{
            const post = JSON.parse(data);
            posts.push({
                title: post.title,
                author: post.author,
                content: post.content,
                slug: file.replace(".json", "") // replace filename as slug
            })
        } catch(err){
            console.error(`failed to parse ${file}`)
        }

        })
           res.json(posts)

      
    })
})



// listen to the port
app.listen(PORT, () => {
    console.log(`server running at port:${PORT}`) 
})






