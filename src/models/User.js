const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username : String,
    email: String,
    password: String
});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // Cuantas veces se encriptara: 10 veces
    return bcrypt.hash(password, salt)
};

module.exports = model('User', userSchema)