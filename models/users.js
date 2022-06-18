"use strict"

const mongoose = require('mongoose')
const { UserRoles } = require('../helpers/Constant')
var Schema = mongoose.Schema
// const mongoosePaginate = require("mongoose-paginate-v2")

var Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    // createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
})

// Schema.plugin(mongoosePaginate);

Schema.statics.createUser = async function () {
    return await this.Save()
}

Schema.statics.getAll = async function () {
    return await this.find({ isDeleted: false }).sort({ name: 1 }).exec();
}

Schema.statics.getById = async function (id) {
    return await this.findOne({ _id: id, isDeleted: false }).exec();
}

Schema.statics.getUserByMobileOrEmail = async function (loginUser) {
    return await this.findOne({
        $or: [
            { email: loginUser },
            { mobile: loginUser }
        ], isDeleted: false
    }).exec()
}

Schema.statics.updateUser = async function (data) {
    return await this.findOneAndUpdate({
        _id: data.id
    }, {
        $set: data
    }, {
        new: true
    })
}

// Schema.statics.getById = function (id) {
//     return this.findOne({ _id: id }).exec();
// }

Schema.statics.deleteUser = async function (id) {
    return await this.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })

}

Schema.statics.getUsersFromArrayOfIds = async function (ids) {
    return await this.find({
        '_id': { $in: ids }
    }).select("name")

}

Schema.statics.getProjectManager = async function () {
    return await this.find({ isDeleted: false, role: UserRoles.Project }).select("name").sort({ name: 1 }).exec();
}

Schema.statics.getUserByRole = async function (Role) {
    return await this.find({ isDeleted: false, role: Role }).sort({ name: 1 }).exec();
}


module.exports = mongoose.model("User", Schema)