const bcrypt = require("bcryptjs");

const User = require("../models/user");

const helpers = require("../utils/helpers");

module.exports = {
  createUser: async function (args, req) {
    const {email, password, name} = args;
    try {
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
    } catch (err) {}
  },
};
