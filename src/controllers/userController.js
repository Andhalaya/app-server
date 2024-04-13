const User = require('../models/User');
const Post = require('../models/Post')

exports.getUsers = async (req, res) => {
    try{
        const users = await User.find().populate('posts')
        res.status(201).json(users)
    } catch(error) {
        console.error('Error getting users', error);
        res.status(500).json({message: 'Internal server error'})
    }
}

exports.getSelf = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    } catch(error) {
        console.error('Error getting user', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
       
        const user = await User.findOneAndDelete({ _id: req.user });
        if (!user) return res.status(404).json({ message: "User not found" });

        await Post.deleteMany({ user: user._id });

        res.json("User and associated posts successfully deleted");
    } catch (error) {
        console.error('Error deleting user and posts', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
