const {Router} = require('express');
const router = Router();

const authController = require('../src/controllers/auth.controller')
const {verifyLoginBody, verifyRegisterBody, verifyEmail, verifyOTP, verifyPassword} = require('../src/middlewares/auth.middleware');

router.post('/login', verifyLoginBody, authController.login);
router.post('/register', verifyRegisterBody, authController.register); 
router.post('/forgot-password', verifyEmail, authController.forgotPassword);
router.post('/verify-otp', verifyOTP, authController.verifyOTP);
router.post('/reset-password', verifyPassword, authController.resetPassword);

module.exports = router