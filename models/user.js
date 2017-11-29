//  用户表
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    gender: {
      type: Sequelize.INTEGER(1),
      defaultValue: 1,
      comment: '性别'
    },
    avatar: {
      type: Sequelize.STRING,
      defaultValue: 'http://res.cloudinary.com/hezf/image/upload/v1467186691/vwuj8a3tpuqoy5fzuzlw.png',
      comment: '头像'
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
      comment: '密码'
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true,
      comment: '邮箱'
    },
    createdTime: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      field: 'created_time',
      comment: '创建时间'
    }
  },
    { tableName: 'user' })
}
