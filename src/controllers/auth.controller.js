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

const resetPassword = async (req, res) => {
    const user = req.user 
    res.status(201).json(user)
}

module.exports = { login, register, resetPassword }