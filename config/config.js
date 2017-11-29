module.exports = {
  development: {
    host: '127.0.0.1',
    url: 'bookmarks', // database name
    database: 'bookmarks',
    dialect: 'mysql',
    username: 'root',
    password: '123456',
    port: 3306
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql'
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: 'mysql'
  },
  test: {
    url: process.env.DATABASE_URL || '',
    dialect: 'mysql'
  }
};