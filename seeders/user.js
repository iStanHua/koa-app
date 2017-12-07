
const md5 = require('../util/md5')

module.exports = [
    {
        "model": "user",
        "data": {
            "name": "admin",
            "gender": 1,
            "password": md5('123456'),
            "phone_number": 15000000000,
            "email": "admin@koa.com"
        }
    },
    {
        "model": "user",
        "data": {
            "name": "zqh",
            "gender": 1,
            "password": md5('123456'),
            "phone_number": 15000000001,
            "email": "zqh@koa.com"
        }
    }
]