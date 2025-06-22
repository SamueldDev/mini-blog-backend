import express from "express"
import cors from "cors"
import sequelize from "./config/db.js"
import dotenv from "dotenv"
dotenv.config()
import userRoute  from "./routes/userRoute.js"
import postRoute from "./routes/postRoute.js"
import { setupSwagger } from "./config/swagger.js"
const PORT = process.env.PORT || 5000;

const app = express()
setupSwagger(app)

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

app.get("/", (req, res) => {
  res.send("mini_blog API is Live")
})

app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)  

const start = async () => {
    try{
      await sequelize.authenticate()
      console.log('DB connected')

      await sequelize.sync({ alter: true})
      console.log("database synced ")

      app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
      })
    }catch(err){  
        console.error("Unable to connect to database:", err)
    }
}

start()









 //  await sequelize.sync({ force: true})
      // console.log("tabeles dropped and recreated ")




