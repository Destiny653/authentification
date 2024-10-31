const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/level4_auth')
.then(connection=>{
    const app = express();
    app.use(cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:5501'],
        credentials: true
    }))
    const port = 3000;
    const authRoute = require('./routes/auth.route');
    const adminRoute = require('./routes/admin.route');
    app.use(express.json());
    app.use('/api/auth', authRoute);
    app.use('/api/admin', adminRoute);

    app.listen(port, ()=>{
        console.log(`Server running on port ${port}`)
    })


}).catch((error)=>{
    console.log(error);
})