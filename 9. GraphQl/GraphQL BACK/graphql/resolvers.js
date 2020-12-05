const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const helpers = require("../utils/helpers");

module.exports = {
  createUser: async function ({userInput}, req) {
    const {email, password, name} = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({message: "E-mail is invalid."});
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, {min: 5})
    ) {
      errors.push({message: "Passwrod too short!"});
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      helpers.checkElemHandler(false, "User exists already!");
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return {...createdUser._doc, _id: createdUser._id.toString()};
  },
  login: async function ({email, password}) {
    const user = await User.findOne({email: email});
    helpers.checkElemHandler(user, "User not found", 401);
    const isEqual = await bcrypt.compare(password, user.password);
    helpers.checkElemHandler(isEqual, "Password is incorrect!", 401);
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "somesupersecretsecret",
      {expiresIn: "1h"}
    );
    return {token, userId: user._id.toString()};
  },
};
