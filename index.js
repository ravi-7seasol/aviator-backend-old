const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
var database = require("./database/database");
const { Server } = require('socket.io');
dotenv.config()

const port = process.env.PORT || 5002

app.use(cors())
app.use(express.json())


app.all("*", function (req, res, next) {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization ,Accept"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type, Authorization"
    );
    next();
});

const server = http.createServer(app);
// const io = require('socket.io')(server);
const io = new Server(server, {
    // allowEIO3: true, // false by default
    // path: '/socket.io',
    // transports: ['websocket'],
    // secure: true,
    cors: {
        // origin: "https://phenomenal-gecko-05a012.netlify.app/",
        origin: "http://localhost:3001/",
        methods: ["GET", "POST"],
        secure: true,
    }
})

require('./config/socket')(app, io);

function setupRoutes() {
    const routes = require("./routes/routes")
    routes.setup(app)
}

setupRoutes()

server.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

