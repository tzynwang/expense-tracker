const nodemailer = require('nodemailer')

function resetPasswordMail (email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  const expiredTime = new Date(Date.now() + 1.8e+6)
  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: email,
    subject: '【家庭記帳本】重設密碼',
    html: `
    <p>請<a target="_blank" href="http://localhost:3000/user/resetPassword/${token}">點此</a>重設密碼</p>
    <p>本連結會在30分鐘後（${expiredTime}）失效</p>`
  }
  transporter.sendMail(mailOptions)
}

module.exports = { resetPasswordMail }
