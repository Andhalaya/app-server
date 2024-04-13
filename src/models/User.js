const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        userName:{
            type: String,
            required: true,
            min: 5,
            max: 20
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        friends: {
            type: Array,
            default: [],
        },
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        location: String,
        occupation: String,
    },
    { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;