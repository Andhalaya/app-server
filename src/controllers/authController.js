const { validationResult, body } = require('express-validator');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generateToken } = require('../middlewares/authMiddleware');

exports.register = [
    body("fullName").trim().escape().notEmpty().withMessage("Full name is required."),
    body("userName").trim().escape().notEmpty().matches(/^\S+$/).withMessage("Username must be a single word without spaces").isLength({ min: 3, max: 20 }).withMessage("Username must have between 3 and 20 characters."),
    body("email").trim().escape().isEmail().withMessage("Email is not valid."),
    body("password").trim().escape().isLength({ min: 6 }).withMessage("Password must have at least 6 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^*?&~#\.?])[A-Za-z\d@$!%*?&]+$/).withMessage("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? &)"),
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, userName, password } = req.body;

            const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
            if (existingUser) {
                return res.status(400).json({ msg: 'User with the same email or username already exists.' });
            }

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new User({
                fullName: req.body.fullName,
                userName: req.body.userName,
                email: req.body.email,
                password: passwordHash,
                occupation: req.body.occupation,
                location: req.body.location 
            });

            await newUser.save();

            res.status(201).json({ message: "Successfully registered." });
        } catch (error) {
            console.error('Failed to create new user:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
];

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ errors: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ errors: "Invalid credentials. " });

        const token = generateToken(user); 
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};