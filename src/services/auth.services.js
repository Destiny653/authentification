const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyIfIsUnique = async (field, value) => {
    return await User.findOne({ [field]: value });
}
const verifyEmail = async (email) => {
    return await User.findOne({ "email": email })
}

async function comparePasswords(value, hash) {
    try {
        return await bcrypt.compare(value, hash);
    } catch (error) {
        throw new Error('Invalid password: ' + error.message)
    }
}

async function tokenVerify(token) {
    try {
        return await jwt.verify(token, 'secret_key');
    } catch (error) {
        throw new Error('Invalid token: ' + error.message)
    }
}

async function hashPassword(password) {
    try {

        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt)
    } catch (error) {
        throw new Error('Invalid password: ' + error.message)
    }
}

const register = async (data) => {
    const password = await hashPassword(data.password)
    data.password = password;

    const user = new User(data)
    await user.save()
    return {
        error: false,
        message: 'User registered successfully',
        user
    }
}

const login = async (user, password) => {
    const compare = await comparePasswords(password, user.password)
    if (compare) {
        return {
            error: false,
            message: 'Login successful',
            user
        }
    }
    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    return {
        error: false,
        message: 'Invalid credentials',
        token: token
    }
}
const email = async (data) => {
    const password = await hashPassword(data.password)
    data.password = password;
    console.log('data log: ', data); const userData = await User.updateOne({ "email": data.email }, { "email": data.email, "password": data.password })
    return {
        error: false,
        message: 'User registered successfully',
        userData
    }
}


module.exports = { verifyIfIsUnique, register, login, email, tokenVerify, verifyEmail }