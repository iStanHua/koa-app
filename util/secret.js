const crypto = require('crypto')

function Secret() { }
/**
 * 加密
 * @param {String|Buffer} data 数据         
 * @param {String} algorithm   算法  ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512']
 * @param {String|Buffer} key  密钥
 */
Secret.Encrypt = (data, algorithm, key) => {
    var c = null
    if (key) {
        c = crypto.createHmac(algorithm, key)
    } else {
        c = crypto.createHash(algorithm)
    }
    c.update(data)
    return c.digest('hex')
}
/**
 * 签名
 * @param {String|Buffer} data 数据         
 * @param {String|Buffer} key  密钥
 */
Secret.Sign = (data, key) => (data + '.' + this.Encrypt(data, 'sha256', key))
/**
 * 反向签名
 * @param {String|Buffer} data 数据         
 * @param {String|Buffer} key  密钥
 */
Secret.Unsign = (data, key) => {
    var temp = data.slice(0, data.lastIndexOf('.'))
    var mac = Secret.Sign(temp, key)
    return mac == data ? temp : false
}
/**
 * ASE加密
 * @param {String|Buffer} data 数据         
 * @param {String|Buffer} key  密钥
 */
Secret.ASE_Encrypt = (data, key) => {
    var cipher = crypto.createCipheriv('aes-128-ecb', key, Buffer.alloc(0))
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}
/**
 * ASE解密
 * @param {String|Buffer} data 数据         
 * @param {String|Buffer} key  密钥
 */
Secret.ASE_Decrypt = (data, key) => {
    var cipher = crypto.createDecipheriv('aes-128-ecb', key, Buffer.alloc(0))
    return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8')
}

/**
 * 创建token
 * @param {String|Buffer} publicKey   公钥         
 * @param {String|Buffer} privateKey  私钥      
 * @param {String|Buffer} ts          
 */
Secret.CreateToken = (publicKey, privateKey, ts) => {
    return this.Encrypt(`${publicKey}:${privateKey}:${ts}`, 'sha1')
}
/**
 * 验证token
 * @param {String|Buffer} publicKey   公钥         
 * @param {String|Buffer} privateKey  私钥      
 * @param {String|Buffer} ts             
 * @param {String|Buffer} signOrigin  token       
 */
Secret.ValidToken = (publicKey, privateKey, ts, signOrigin) => {
    var sign = this.CreateToken(publicKey, privateKey, ts)
    return (sign === signOrigin)
}

exports = module.exports = Secret