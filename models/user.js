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
      type: DataTypes.STRING(16),
      unique: true,
      comment: '用户名',
      validate: {
        len: [3, 16],
      },
      get: function () {
        return this.getDataValue('name')
      }
    },
    gender: {
      type: DataTypes.TINYINT(2),
      defaultValue: '3',
      comment: '1:男，2：女，3：未知'
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'http://res.cloudinary.com/hezf/image/upload/v1467186691/vwuj8a3tpuqoy5fzuzlw.png',
      comment: '头像'
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: '密码'
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      comment: '邮箱',
      validate: {
        isEmail: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(11),
      unique: true,
      field: 'phone_number',
      comment: '手机号',
      validate: {
        is: /^1[3|5|6|7|8|9][0-9]{9}$/
      }
    },
    active: {
      type: DataTypes.TINYINT(2),
      defaultValue: 1,
      comment: '0:不可用，1:可用'
    },
    createdTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_time',
      comment: '创建时间'
    },
    updatedTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_time',
      comment: '更新时间'
    },
    deletedTime: {
      type: DataTypes.DATE,
      field: 'deleted_time',
      comment: '删除时间'
    }
  }, {
      tableName: 't_user',
      paranoid: true,     // 删除时不进行物理删除
      getterMethods: {},  // 获取时添加一些处理后的参数
      setterMethods: {},  // 存储时进行处理
      validate: {}        // 一些组合校验 
    })
}
