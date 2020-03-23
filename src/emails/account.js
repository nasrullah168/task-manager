const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'mohd_nasrullah@outlook.in',
        subject: 'Welcome to Task Mangment App',
        text: `Hey ${name} thanks for signup. Enjoy our app!`
    });
}


const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mohd_nasrullah@outlook.in',
        subject: 'Sorry to see you Go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}