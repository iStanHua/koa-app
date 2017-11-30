module.exports = {
  development: {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    database: 'koa_starter',
    username: 'root',
    password: '123456',
    ssl: false,
    timezone: '+08:00'
  },
  production: {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    database: 'koa_starter',
    username: 'root',
    password: '123456',
    ssl: false,
    timezone: '+08:00'
  }
}