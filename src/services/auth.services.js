const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const UserOTP = require('../models/UserOTP')

const random = async (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
const generateExpired = (minutes) => {
    return new Date(new Date().getTime() + (60 * 1000 * minutes));
}
const verifyIfIsUnique = async (field, value) => {
    return await User.findOne({ [field]: value });
}
// const verifyEmail = async (email) => {
//     return await User.findOne({ "email": email })
// }

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
        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
        return {
            error: false,
            message: "Credentials validated",
            user,
            token: token
        }
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

const generateOTP = async (id_user) => {
    try {
        const code = await random(5)
        const otp = {
            code: code,
            id_user: id_user,
            expired_at: generateExpired(10),
        }

        console.log('otp is:', otp);
        
        const userOTP = new UserOTP(otp)
        await userOTP.save()
        return {
            error: false,
            message: 'OTP generated successfully',
            otp
        }
    } catch (error) {
        return {
            error: true,
            message: 'Error generating OTP' + error.message
        }
    }
}

const verifyOTP = async (email, code) => {
    const userOTP = await UserOTP.findOne({ "code": code, "expired_at": { $gt: new Date() } }).populate({ path: 'id_user', select: { email: 1 } });
    return !!(userOTP && userOTP.id_user.email === email);
}

const resetPassword = async (password, code) => {
    try {
        const userOTP = await UserOTP.findOne({ code: code })
        if (!userOTP) {
            return {
                error: true,
                message: 'Invalid OTP'
            }
        }
        const user = await User.findById(userOTP.id_user)
        if (!user) {
            return {
                error: true,
                message: 'User not found'
            }
        }
        user.password = await hashPassword(password)
        await user.save()
        UserOTP.deleteOne({ _id: userOTP._id });
        return {
            error: false,
            message: 'Password reset successfully',
            data: {
                email: user.email
            }
        }
    } catch (error) {
        return {
            error: true,
            message: 'Error resetting password' + error.message
        }
    }
}

module.exports = { 
    verifyIfIsUnique, register, login, email, resetPassword, 
    tokenVerify, generateOTP, verifyOTP }