"use strict"
const dotenv = require('dotenv')
dotenv.config()
var mongoose = require('mongoose')
mongoose.connect(`${process.env.DB_CONNECTION}`,{useUnifiedTopology: false})
function connect() {
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log(`Database connected successfully`);
    });
}
connect()

console.log("-- done.");