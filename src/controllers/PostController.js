const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate('user')
        res.status(200).json(posts)
    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message})
    }
}

exports.createPost = async (req, res) => {
    try{
        const uploadedFile = req.file;
        const filePath = uploadedFile
            ? '/uploads/' + uploadedFile.filename
            : '';

        const newPost = new Post({ 
            user: req.body.user,
            title: req.body.title, 
            description: req.body.description, 
            profilePicture: filePath, 
            codeSnippet: req.body.codeSnippet, 
            link: req.body.link,
            tags: req.body.tags
        })
        const savedPost = await newPost.save();
        const savedPostId = savedPost._id;
        const user = await User.findById(req.body.user);

        if(!user) {
            return res.status(404).json({ message: 'User not found'})
        }

        user.posts.push(savedPostId);
        await user.save();

        res.status(200).json({
            message: 'Post successfully created',
            newPost: savedPost
        }) 
        
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.deletePost = async (req, res) => {
    try{
        const postId = req.params.postId
        await Post.findOneAndDelete({ _id: postId})
        
        res.status(200).json({ message: 'Post successfully deleted'});
        
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.likePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;

      const post = await Post.findById(postId);
      const isLiked = post.likes.includes(userId);
  
      if (isLiked) {

        post.likes = post.likes.filter(id => id !== userId);

      } else {
  
        post.likes.push(userId);
      }
  
      const updatedPost = await post.save();
  
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try{
        const { postId } = req.params;
        const { userId } = req.body; 
        const {comment} = req.body;
        const time = Date.now();

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({ message: 'Post not found'}) 
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        post.comments.push({userId: userId, user: user.fullName, profilePicture: user.profilePicture, comment: comment, time: new Date(time)})

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}