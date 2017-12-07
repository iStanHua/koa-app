const secret = 'koa-mysql'
const jwt = require('jsonwebtoken')

module.exports = {
    /**
     * 生成accessToken
     * @param {String|Object|Buffer} payload - Payload to sign, could be an literal, buffer or string
     * @returns {String} The JSON Web Token string
     */
    create: (payload) => {
        return jwt.sign(payload, secret, { expiresIn: '1h' })
    },
    /**
     * token解码
     *  @param {String} token - JWT string to decode
     *  @returns {Object} The decoded token.
     */
    verify: (token) => {
        return jwt.verify(token, secret)
    }
}