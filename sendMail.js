const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'fokundem.com@gmail.com',
        pass: 'fram hxmo nbio zpbe'
    }
});

transporter.sendMail({
    from: 'Fokundem.com@gmail.com',
    to: 'destinymbahmukong@gmail.com',
    subject: 'Testing Nodemailer',
    text: 'Hello, this is a test email.'
}).then(send=>{
    console.log('Email sent successfully');
}).catch(err=>{
    console.log('Error sending email:', err);
})