"use strict";

const User = require("../models/users");
const httpStatus = require('http-status');
const APIResponse = require("../helpers/APIResponse");
const { hashPassword, comparePassword } = require("../utils/bcrypt.helper");
const { getJWTToken } = require("../utils/jwt.helper");

class UserController {

    async login(req, res, next) {
        try {
            const userLogin = req.body.user_name.toLowerCase()
            const user = await User.getUserByMobileOrEmail(userLogin)
            if (user) {
                const match = await comparePassword(req.body.password, user.password)
                if (match) {
                    const token = getJWTToken({
                        id: user.id,
                        email: req.body.email
                    });

                    let newUser;
                    newUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token: token
                    };

                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse(newUser, "Login Successfully", httpStatus.OK)
                        );
                }
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            null,
                            "Wrong Password",
                            httpStatus.OK,
                            "Wrong Password"
                        )
                    );
            }

            return res.status(httpStatus.OK).json(new APIResponse(user, 'Wrong Email', httpStatus.OK));
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async signUp(req, res, next) {
        let body = req.body;
        const newPassword = await hashPassword(req.body.password, 10);
        const newUser =
        {
            name: body.name,
            email: body.email.toLowerCase(),
            mobile: body.mobile,
            password: newPassword,
        }
        const model = new User(newUser);
        try {
            const alreadyExist = await User.getByEmail(req.body.email);
            if (!alreadyExist) {

                const saveResponse = await model.save();
                return res.status(httpStatus.OK).json(new APIResponse(saveResponse, 'User created successfully.', httpStatus.OK));

            } else if (alreadyExist.mobile === req.body.mobile) {
                res
                    .status(httpStatus.OK)
                    .send({ message: "moblie is already exist" });
            } else if  (alreadyExist.email === req.body.email) {
                res
                    .status(httpStatus.OK)
                    .send({ message: "email is already exist" });
            } else {
                res
                    .status(httpStatus.OK)
                    .send({ message: "Error Adding User" });
            }

        } catch (e) {
            if (e.code === 11000) {
                return res
                    .status(httpStatus.OK)
                    .send({ message: "user is already exist" });
            } else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(new APIResponse({}, 'Error Adding User', httpStatus.INTERNAL_SERVER_ERROR, e));
            }
        }
    }

    async getAllUser(req, res, next) {
        try {
            const user = await User.getAll()

            // let perpage = +req.query.perpage
            // let pageno = +req.query.pageno
            // let offset = await (pageno - 1)*perpage
            // let newresult
            // await User.paginate({},{ offset: offset, limit: 10 }).then((resa) => {
            //     newresult = resa

            // }).catch((err) => console.log(err))


            if (user) {
                return res.status(httpStatus.OK).json(new APIResponse(user, 'User get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async getUserById(req, res, next) {
        try {
            const user = await User.getUserById(req.params.id)

            if (user) {
                return res.status(httpStatus.OK).json(new APIResponse(user, 'User get successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });
        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async editUser(req, res, next) {
        try {
            const alreadyExist = await User.matchEmail(req.body.email);
            if (alreadyExist.length === 1) {
                if (alreadyExist[0]._id.toString() !== req.body.id) {
                    return res.status(httpStatus.OK).json(new APIResponse({}, 'email is already exist', httpStatus.OK));
                }
            } else if (alreadyExist.length > 1) {
                return res.status(httpStatus.OK).json(new APIResponse({}, 'email is already exist', httpStatus.OK));
            }

            const user = await User.getUserById(req.body.id)

            if (user) {

                const updatedUser = await User.updateUser(req.body)

                return res.status(httpStatus.OK).json(new APIResponse(updatedUser, 'User updated successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });

        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await User.getUserById(req.params.id)

            if (user) {

                await User.deleteUser(req.params.id)

                return res.status(httpStatus.OK).json(new APIResponse({}, 'User deleted successfully.', httpStatus.OK));
            }

            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "user not found" });

        }
        catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .send({ message: "Somethig went wrong" });
        }
    }

    async verifyUser(req, res, next) {
        try {
            // const userRepo = getRepository(User);
            // const user = await userRepo.findOne({ where: { id: req.user.id } });
            const user = await User.getUserById(req.user.id)
            if (!user) {
                return res
                    .status(401)
                    .json(new APIResponse(null, "User not found", 401));
            }

            const token = getJWTToken({
                id: user.id,
                email: req.body.email
            });

            let newUser;
            newUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            };

            return res
                .status(httpStatus.OK)
                .json(new APIResponse(newUser, "User verified", 200));
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "User not found", httpStatus.BAD_REQUEST, error)
                );
        }
    }


}

var exports = (module.exports = new UserController());