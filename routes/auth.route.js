const {Router} = require('express');
const router = Router();

const authController = require('../src/controllers/auth.controller')
const {verifyLoginBody, verifyRegisterBody, verifyEmailOfPassword} = require('../src/middlewares/auth.middleware');

router.post('/login', verifyLoginBody, authController.login);
router.post('/register', verifyRegisterBody, authController.register);
router.put('/update', verifyEmailOfPassword, authController.resetPassword)

module.exports = router