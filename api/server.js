const express = require("express");
const server = express();
const router = require("./recipes/recipeRouter");
server.use(express.json());


server.use("/api/recipes",router);


server.use((err,req,res,next)=>{
    let message = "server error";
    try{
        message = err.toString();
    }
    catch{
        try{
            message = err.message;
        }
        catch{
            //do nothing
        }
    }
    res.status(500).json({message});
});


module.exports = server;