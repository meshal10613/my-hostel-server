const userService = require("../services/userService");

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers(req.query.search);
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const createOrUpdateUser = async (req, res, next) => {
    try {
        const user = await userService.createOrUpdateUser(req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const makeAdmin = async (req, res, next) => {
    try {
        const result = await userService.makeAdmin(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { getUsers, createOrUpdateUser, makeAdmin };
