const {Router} = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

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

router.get('/me', (req, res, next) => {
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }

    const decoded = jwt.verify(token, config.secret)
    console.log(decoded)

    res.json('me');
});

router.post('/signin', (req, res, next) => {
    res.json('signin');
});



module.exports = router;