const helpers = require('../utils/helpers');
const Post = require('../models/post');

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

    if(!imageUrl){
        const error = new Error('No file picked.');
        error.statusCode = 404;
        throw error;
    }

    Post.findById(postId)
        .then(post => {
            helpers.checkElemHandler(post, 'Could not find post');
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
        //    checked logged in user
            helpers.clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);

        })
        .then(result => {
            console.log(result);
            res.status(200)
                .json({
                    message: 'Post was deleted.'
                })
        })
        .catch((err) => helpers.catchErrorHandler(err, next))
};

