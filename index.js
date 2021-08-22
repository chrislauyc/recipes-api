require("dotenv").config();
const server = require("./api/server");

if(!process.env.NODE_ENV){
    const morgan = require("morgan");
    server.use(morgan("dev"));
}

const port = process.env.PORT || "5000";
server.listen(port,()=>console.log(`server is listening at port ${port}`));