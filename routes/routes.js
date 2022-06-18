"use strict"

const { jwtSecret } = require("../config");
const { expressjwt: jwt } = require("express-jwt");
var router = require("express").Router();
var exports = {}

exports.setup = function (app) {
    console.log("Setup Route");
     
    var defaultRoute = require("../routers/default");
    var users = require("../routers/users");

    // app.use(
    //     "/",
    //     jwt({ algorithms: ["HS256"], secret: jwtSecret }).unless({
    //       path: [
    //         "/users/login"
    //       ],
    //     })
    //   );

    app.use('/',defaultRoute)
    app.use('/users',users)
};

module.exports = exports;