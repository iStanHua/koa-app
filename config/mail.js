module.exports = {
  qq: {
    host: 'smtp.qq.com',
    port: 587,
    secure: false,  // true for 465, false for other ports
    auth: {
      user: 'xxxx@qq.com', // generated ethereal user
      pass: '123456'  // generated ethereal password
    }
  },
  163: {
    host: 'smtp.163.com',
    port: 994,
    secure: false,  // true for 465, false for other ports
    auth: {
      user: 'zqh@163.com', // generated ethereal user
      pass: '123456'  // generated ethereal password
    }
  },
  aliyun: {
    host: 'smtp.mxhichina.com',
    port: 25,
    secure: false,  // true for 465, false for other ports
    auth: {
      user: 'xxxx@aliyun.com', // generated ethereal user
      pass: '123456'  // generated ethereal password
    }
  }
}