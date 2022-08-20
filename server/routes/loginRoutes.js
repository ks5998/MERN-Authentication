const UserSchema = require('../models/UserSchema')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router();

//register new user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: 'password and email are required' })
    
    if (password.length < 8)
        return res.status(400).json({ msg: 'password should be atleast 8 characters long' })

    const user = await UserSchema.findOne({ email })
    if (user)
        return res.status(400).json({ msg: 'User already exists' })

    const newUser = await UserSchema({ email, password })
    bcrypt.hash(password, 7, async (err, hash) => {
        if (err)
            return res.status(400).json({ msg: 'error while saving the password' })
        
        newUser.password = hash
        const savedUserRes = await newUser.save();

        if (savedUserRes)
            return res.status(200).json({ msg: 'user is seccessfully created' })
    });
});

//login the user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password){
        res.status(400).json({ msg: 'try again' })
    }

    const user = await UserSchema.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ msg: 'user not found'})
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (matchPassword) {
        const userSession = { email: user.email }
        req.session.user = userSession
        return res.status(200).json({ msg: 'logged in successfully', userSession })
    } else {
        return res.status(400).json({ msg: 'invalid credentials'}) 
    }
});

module.exports = router;