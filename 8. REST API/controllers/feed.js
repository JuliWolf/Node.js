const helpers = require('../utils/helpers');
const Post = require('../models/post');
const User = require('../models/user');
const io = require('../socket');


exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try{
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts,
            totalItems
        });
    }catch(err){
        helpers.catchErrorHandler(err, next)
    }

};

exports.createPost = async (req, res, next) => {
    helpers.checkErrorsHandler(req);
    helpers.checkFileHandler(req);
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req. body.content;

    const post = new Post({
        title,
        content,
        imageUrl,
        creator: req.userId
    });
    try{
        await post.save()
        const user = await User.findById(req.userId)
        user.posts.push(post);
        await user.save();
        io.getIO().emit('posts', { action: 'create', post: post });
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    }catch(error){
        helpers.catchErrorHandler(error, next)
    }
};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try{

    }catch(err){
        helpers.catchErrorHandler(err, next)
    }
    const post = await Post.findById(postId)
    helpers.checkElemHandler(post, 'Could not find post');
    res.status(200)
        .json({
            message: 'Post fetched.',
            post
        })
};

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    helpers.checkErrorsHandler(req);

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path;
    }

    helpers.checkElemHandler(imageUrl, 'No file picked.', 404);
    try{
       const post =  await Post.findById(postId);
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
        const updatedPost = await post.save();
        res.status(200)
            .json({
                message: 'Post updated!',
                post: updatedPost
            })
    }catch(err){
        helpers.catchErrorHandler(err, next)
    }
};

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findById(postId);
        helpers.checkElemHandler(post, 'Could not find post');

        if(post.creator.toString() !== req.userId){
            helpers.checkElemHandler(false, 'Not authorized!', 403);
        }

        helpers.clearImage(post.imageUrl);
        await Post.findByIdAndRemove(postId);
        const user = await User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();
        res.status(200)
            .json({
                message: 'Post was deleted.'
            });
    }catch(err){
        helpers.catchErrorHandler(err, next)
    }
};

