const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator');

const Post = require('../models/post');


const catchErrorHandler = (err) => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
};

const checkPostHandler = (post) => {
    if(!post){
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
    }
};

const checkFileHandler = (req) => {
    if(!req.file){
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
};

const checkErrorsHandler = (req) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
};

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts
            });
        })
        .catch(catchErrorHandler);
};

exports.createPost = (req, res, next) => {
    checkErrorsHandler(req);
    checkFileHandler(req);
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req. body.content;
    const post = new Post({
        title,
        content,
        imageUrl,
        creator: {
            name: 'Julia'
        }
    });
    post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post created successfully!',
                post: result
            });
        })
        .catch(catchErrorHandler);
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            checkPostHandler(post);
            res.status(200)
                .json({
                    message: 'Post fetched.',
                    post
                })
        })
        .catch(catchErrorHandler);
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    checkErrorsHandler(req);

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path;
    }

    if(!imageUrl){
        const error = new Error('No file picked.');
        error.statusCode = 404;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            checkPostHandler(post);
            if(imageUrl !== post.imageUrl){
                clearImage(post.imageUrl);
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
        .catch(catchErrorHandler)
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};