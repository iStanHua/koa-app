const nodemailer = require('nodemailer')
const mailConfig = require('../config/mail')

/**
 * 发送邮件
 * @param {Object} options         邮件参数
 * @param {String} options.from    发件人地址
 * @param {String} options.to      接收者列表(用,分割)
 * @param {String} options.subject 主题
 * @param {String} options.text    纯文本正文
 * @param {String} options.html    html正文
 */
module.exports = (options) => {
    let transport = nodemailer.createTransport(mailConfig.qq)

    // setup email data with unicode symbols
    let mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    }

    // send mail with defined transport object
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
}