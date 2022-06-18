"use strict";

var router = require("express").Router();

const httpStatus = require("http-status");
const Joi = require("joi");
const APIResponse = require("../helpers/APIResponse");

const userController = require("../controllers/users");
const { UserRoles } = require("../helpers/Constant");

const createValidation = Joi.object({
    name: Joi.string().error(new Error('Please enter valid name')),
    password: Joi.string().error(new Error('Please enter valid password')),
    mobile: Joi.string().error(new Error('Please enter your mobile')),
    email: Joi.string().trim().email().error(new Error('Please enter valid Email'))
});

const editValidation = Joi.object({
    id: Joi.string().error(new Error('Please enter user Id')),
    name: Joi.string().error(new Error('Please enter valid name')),
    password: Joi.string().error(new Error('Please enter valid password')),
    mobile: Joi.string().error(new Error('Please enter your mobile')),
    email: Joi.string().trim().email().error(new Error('Please enter valid Email'))
});

const loginValidation = Joi.object({
    user_name: Joi.string().trim().error(new Error('Please enter Email/Mobile')),
    password: Joi.string().error(new Error('Please enter password'))
});

router.post("/add_user", signUpValidate, userController.signUp);
router.post("/login", loginValidate, userController.login);

function signUpValidate(req, res, next) {
    const Data = req.body;
    const { error, value } = createValidation.validate(Data);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
        return next();
    }
}

function loginValidate(req, res, next) {
    const Data = req.body;
    const { error, value } = loginValidation.validate(Data);
    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
    } else {
        return next();
    }
}

// function editValidate(req, res, next) {
//     const Data = req.body;
//     const { error, value } = editValidation.validate(Data);
//     if (error) {
//         return res.status(httpStatus.BAD_REQUEST).json(new APIResponse(null, error.message, httpStatus.BAD_REQUEST));
//     } else {
//         return next();
//     }
// }

module.exports = router;