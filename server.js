// Complete the server.js file to make user's add, delete and update the todos.
import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { connectToDatabase } from "./db.config.js"
import Task from "./task.schema.js"

//Creating a express app
const app = express();

//Create a http server
export const server = http.createServer(app);

//Initialize Socket.io
const io = new Server(server,{
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
})

//Handle client connections
io.on("connection", (socket) => {
    console.log("Connection Made");

    //Setting up listener to the client to handle new_task event
    socket.on("create_task", (text)=>{
        
        //Just before broadcasting we will save it to database

        const newTask=  new Task({
            text: text,
            createdAt: new Date()
        })
        newTask.save();

        // console.log(text)
        //Now Broadcast it
        socket.broadcast.emit("broadcast_task", newTask )

    })

    //Handle disconnect
    socket.on("disconnect", () =>{
        console.log("Connection disconnected")
    })
})


