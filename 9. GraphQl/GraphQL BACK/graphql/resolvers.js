const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");

const helpers = require("../utils/helpers");
const post = require("../models/post");

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
  createPost: async function ({postInput}, req) {
    helpers.checkElemHandler(req.isAuth, "Not authenticated!", 401);

    const {title, content, imageUrl} = postInput;
    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, {min: 5})) {
      errors.push({message: "Title is invalid"});
    }
    if (validator.isEmpty(content) || !validator.isLength(content, {min: 5})) {
      errors.push({message: "Content is invalid"});
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);
    helpers.checkElemHandler(user, "Invalid User", 401);

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  getPost: async function ({postId}, req) {
    const post = await Post.findById(postId);
  },
  getPosts: async function ({page}, req) {
    helpers.checkElemHandler(req.isAuth, "Not authenticated!", 401);

    if (!page) {
      page = 1;
    }
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({createdAt: -1})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");
    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
};
