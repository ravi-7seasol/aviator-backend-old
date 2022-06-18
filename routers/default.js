"use strict";

var router = require("express").Router();

router.get('/', function (req, res) {
    res.send('Wiki home page');
})

module.exports = router;