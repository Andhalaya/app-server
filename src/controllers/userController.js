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

exports.getUserById = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.params.userId}).populate('posts').populate('projects')
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);

    }catch(error){
        console.error('Error getting user', error);
        res.status(500).json({message: 'Internal server error'})
    }
}

exports.getSelf = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user });
        if (!user) return res.status(404).json({ message: "User not found" });
        const friendsData = await User.find({ _id: { $in: user.friends } });
        res.json({ user: {user, friendsData} });
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

exports.editProfile = async (req, res) => {
    try {
        const { fullName, email, userName, location, occupation, gitHub } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({ message: "Full name and email are required fields" });
        }

        let updateFields = { fullName, email, userName, location, occupation, gitHub };
        if (req.file) {
            const filePath = '/uploads/' + req.file.filename;
            updateFields.profilePicture = filePath;
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.body.id,
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.toggleFriend = async (req, res) => {
    const { userId } = req.body;
    const { friendId } = req.params;

    try {
    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario not found' });
        }
        const index = user.friends.indexOf(friendId);
        if (index === -1) {
  
            user.friends.push(friendId);
        } else {
           
            user.friends.splice(index, 1);
        }
        await user.save();

        return res.status(200).json({ user: user });
    } catch (error) {
        console.error('Error following/unfollowing friend:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.setCoverImage = async (req, res) => {
    const {userId} = req.params;
    const {profileCover} = req.body;

    try{
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.profileCover = profileCover;
        
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    }catch(error){
        console.error("Error updating cover image:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



