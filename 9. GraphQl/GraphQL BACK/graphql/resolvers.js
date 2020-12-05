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
    helpers.checkElemHandler(req.isAuth, "Not authenticated!", 401);

    const post = await Post.findById(postId).populate("creator");
    helpers.checkElemHandler(post, "Post not found", 404);
    return {
      ...post._doc,
      createdAt: post.createdAt.toISOString(),
      _id: post._id.toString(),
      updatedAt: post.updatedAt.toISOString(),
    };
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
  updatePost: async function ({postId, postInput}, req) {
    helpers.checkElemHandler(req.isAuth, "Not authenticated!", 401);

    const post = await Post.findById(postId).populate("creator");
    helpers.checkElemHandler(post, "Post not found", 404);

    if (post.creator._id.toString() !== req.userId.toString()) {
      helpers.checkElemHandler(false, "Not authorized!", 403);
    }

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
    post.title = title;
    post.content = content;
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function ({postId}, req) {
    helpers.checkElemHandler(req.isAuth, "Not authenticated!", 401);

    const post = await Post.findById(postId);
    helpers.checkElemHandler(post, "Post not found", 404);

    if (post.creator.toString() !== req.userId.toString()) {
      helpers.checkElemHandler(false, "Not authorized!", 403);
    }
    helpers.clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    helpers.checkElemHandler(user, "User not found", 404);
    user.posts.pull(postId);
    await user.save();
    return true;
  },
};
