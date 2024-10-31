const authService = require('../services/auth.services')

const login = async (req, res) => {
    try {
        const login = await authService.login(req.user, req.body.password)
        if (!login.error) {
            return res.json(login)
        }
        res.status(401).json({ error: 'Invalid credentials' })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const register = async (req, res) => {
    const create = await authService.register(req.body)
    res.status(201).json(create)
}
const forgotPassword = async (req, res) =>{  
    const otp = await authService.generateOTP(req.user._id)
    const status = otp.error ? 400 : 200;
    console.log(otp);  
    res.status(status).json({otp}) 
}

const verifyOTP = async(req, res)=>{
    return res.status(202).json({
        error:false,
        message: 'OTP verified successfully'
    })
}

const resetPassword = async (req, res)=>{
    const {password, code} = req.body;
    const status = await authService.resetPassword(password, code)
    res.status(201).json(status)
}

module.exports = { login, register, resetPassword, forgotPassword, verifyOTP }