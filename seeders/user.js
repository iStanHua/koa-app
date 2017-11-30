
const md5 = require('../util/md5')

module.exports = [
    {
        "model": "user",
        "data": {
            "name": "zqh",
            "gender": "male",
            "password": md5.md5('123456'),
            "email": "1764918@qq.com",
        }
    },
    {
        "model": "user",
        "data": {
            "name": "George",
            "gender": "male",
            "password": md5.md5('123456'),
            "email": "235435346@qq.com",
        }
    }
]