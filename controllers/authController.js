const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EventEmitter = require('events');

// Event-Driven Feature setup
const authEvents = new EventEmitter();
authEvents.on('userRegistered', (user) => {
    console.log(`[Event] New user registered: ${user.username} (${user.email})`);
});

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        authEvents.emit('userRegistered', newUser);

        res.status(201).json({
            message: "User registered",
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
