import express from "express"
import http from "http"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";
import { Server } from "socket.io"

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = http.createServer(app)
const io = new Server(server) 

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

io.on("connection", function(socket){
  socket.on("send-location", function(data) {
    io.emit("receive-location", { id : socket.id, ...data })
  })

  socket.on("disconnect", function(){
    io.emit("user-disconnected", socket.id)
  })
})

app.get("/", (req, res) => {
  res.render("index")
})

const port = process.env.PORT || 8080 
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
