const key = 'koa'
const crypto = require('crypto')
module.exports = {
    md5: function (password, salt) {
        let _pass = password
        let decipher = crypto.createHash('md5')
        if (salt) {
            decipher = crypto.createHash('md5', key)
            _pass = password + salt
        }
        let _md5 = decipher.update(_pass).digest('hex')
        if (salt) {
            return {
                salt: salt,
                password: _md5
            }
        }
        else {
            return _md5
        }
    }
}