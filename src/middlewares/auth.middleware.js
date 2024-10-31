const authService = require('../services/auth.services')

const verifyLoginBody = async (req, res, next) => {
    const body = req.body;
    console.log('login body', body);

    if (!body.email || !body.password) {
        return res.status(400).json({
            error: true,
            message: 'Email and password are required. Please check your inputs.'
        });
    }
    const user = await authService.verifyIfIsUnique('email', body.email);

    if (!user) {
        return res.status(400).json({
            error: true,
            message: 'Email is not registered. Please register first.'
        });
    }

    req.user = user;
    next();
}


const verifyRegisterBody = async (req, res, next) => {
    const body = req.body;
    console.log('body log: ', body);

    if (!body.first_name || !body.last_name || !body.email || !body.username || !body.password || !body.confirm_password) {
        return res.status(400).json({
            error: true,
            message: 'All user credentials are required. Please check your inputs.'
        });
    }
    if (body.password !== body.confirm_password) {
        return res.status(400).json({
            error: true,
            message: 'Passwords do not match. Please check your inputs.'
        });
    }

    const isUniqueEmail = await authService.verifyIfIsUnique('email', body.email)
    if (isUniqueEmail) {
        return res.status(400).json({
            error: true,
            message: 'Email is already exist. Please choose a different one.'
        });
    }
    const isUniqueUsername = await authService.verifyIfIsUnique('username', body.username)
    if (isUniqueUsername) {
        return res.status(400).json({
            error: true,
            message: 'Username is already in use. Please choose a different one.'
        });
    }

    next();
}
const verifyIfUserIsLogged = async (req, res, next) => {
    const auth = req.header('Authorization');
    if (!auth) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized. Please login first.'
        });
    }
    const verified = authService.tokenVerify(auth);

    if (!verified) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized. Please login first.'
        });
    }
    const user = await authService.verifyIfIsUnique('_id', verified.id);
    if (!user) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized. Please login first.'
        });
    }
    req.auth = user;
    next();
}

const verifyEmail = async (req, res, next) => {
    const {email} = req.body;
    const user = await authService.verifyIfIsUnique('email', email)
    if (!user) {
        return res.status(400).json({
            error: true,
            message: 'Email not found !!!'
        });
    }
    req.user = user
    next();
}

const verifyOTP = async (req, res, next) => {
    const {email, code} = req.body
    const verify = await authService.verifyOTP(email, code);
    if (!verify) {
        return res.status(400).json({
            error: true,
            message: 'Invalid OTP'
        });
    }
    next();
}

const verifyPassword = async (req, res, next) => {
    const {password, confirmPassword, code} = req.body
    if(!code){
        return res.status(400).json({
            error: true,
            message: 'Code is required to change password'
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            error: true,
            message: 'Passwords do not match'
        });
    } 
    next();
}


module.exports = {
    verifyLoginBody, 
    verifyRegisterBody, 
    verifyIfUserIsLogged,  
    verifyEmail,
    verifyOTP,
    verifyPassword
}