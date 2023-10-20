const {Router} = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verifyToken');

const User = require('../models/User');

router.post('/signup', async (req, res, next) => {
    // res.json('signup');
    const {username, email, password} = req.body;
    // console.log(username,email,password)
    const user = new User({
        username : username,
        email: email,
        password: password
    });
    user.password =  await user.encryptPassword(user.password);
    // console.log(user)
    await user.save();
    // res.json({message : 'Received'})

    // sign permite registar y crear un token
    const token = jwt.sign({id: user._id}, config.secret,{
        expiresIn: 60 * 60 * 24 //resultado tiempo 1 dia en segundos: 60 sg x 1 hra x 1 dia
    })

    res.json({auth : true, token: token})
});

router.get('/me', verifyToken,async (req, res, next) => {

    // const decoded = jwt.verify(token, config.secret)
    // console.log(decoded)
    // const user = await User.findById(decoded.id, { password: 0 })
    const user = await User.findById(req.userId, { password: 0 })

    if(!user){
        return res.status(404).send('No user found')
    }

    res.json(user);
});

router.get('/dashboard', verifyToken, (req, res, next) => {
    res.json('dashboard');
});

// Login
router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body
    // console.log(email, password)
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(404).send("The email doesn't exists");
    }

    const validPassword = await user.validatePassword(password);
    // console.log(validPassword)
    if(!validPassword){
        return res.status(401).json({auth: false, token:null})
    }

    const token = jwt.sign({id: user._id}, config.secret,{
        expiresIn: 60 * 60 * 24
    });

    // res.json('signin');
    res.json({auth:true, token});
});



module.exports = router;