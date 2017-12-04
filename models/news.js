//  新闻表
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('news', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(100),
      comment: '标题',
      validate: {
        len: [8, 100],
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '内容'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
      // references: {
      //   model: 'user',
      //   key: 'id'
      // }
    },
    visitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'visit_count',
      comment: '浏览数'
    },
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'like_count',
      comment: '点赞数'
    },
    commentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'comment_count',
      comment: '回复数'
    },
    allowComment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'allow_comment',
      comment: '1：允许评论；0：不允许评论'
    },
    isPublic: {
      type: DataTypes.TINYINT(2),
      defaultValue: 1,
      field: 'is_public',
      comment: '1：公开；0：不公开'
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
      tableName: 't_news',
      paranoid: true,     // 删除时不进行物理删除
      getterMethods: {},  // 获取时添加一些处理后的参数
      setterMethods: {},  // 存储时进行处理
      validate: {}        // 一些组合校验 
    })
}
