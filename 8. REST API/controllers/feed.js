const helpers = require('../utils/helpers');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts,
                totalItems
            });
        })
        .catch((err) => helpers.catchErrorHandler(err, next));

};

exports.createPost = (req, res, next) => {
    helpers.checkErrorsHandler(req);
    helpers.checkFileHandler(req);
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req. body.content;
    let creator;

    const post = new Post({
        title,
        content,
        imageUrl,
        creator: req.userId
    });
    post.save()
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            });
        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            helpers.checkElemHandler(post, 'Could not find post');
            res.status(200)
                .json({
                    message: 'Post fetched.',
                    post
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next));
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    helpers.checkErrorsHandler(req);

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path;
    }

    helpers.checkElemHandler(imageUrl, 'No file picked.', 404);

    Post.findById(postId)
        .then(post => {
            helpers.checkElemHandler(post, 'Could not find post');

            if(post.creator.toString() !== req.userId){
                helpers.checkElemHandler(false, 'Not authorized!', 403);
            }

            if(imageUrl !== post.imageUrl){
                helpers.clearImage(post.imageUrl);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;

            return post.save();
        })
        .then(result => {
            res.status(200)
                .json({
                    message: 'Post updated!',
                    post: result
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next))
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post =>{
            helpers.checkElemHandler(post, 'Could not find post');

            if(post.creator.toString() !== req.userId){
                helpers.checkElemHandler(false, 'Not authorized!', 403);
            }

            helpers.clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);

        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200)
                .json({
                    message: 'Post was deleted.'
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next))
};

