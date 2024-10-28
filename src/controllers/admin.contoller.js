const welcome = (req, res)=>{
    res.json({
        message: "Welcome to Admin Panel!"
    })
}

module.exports = {welcome};