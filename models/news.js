//  新闻表
module.exports = function (sequelize, DataTypes) {
  const news = sequelize.define('news', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    visit_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '浏览数'
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '点赞数'
    },
    comment_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '回复数'
    },
    allow_comment: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: '1：允许评论；0：不允许评论'
    },
    is_public: {
      type: DataTypes.TINYINT(2),
      defaultValue: 1,
      comment: '1：公开；0：不公开'
    }
  },
    {
      // 定义表的名称
      tableName: 't_news',
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ],
      getterMethods: {},
      // 存储时进行处理
      setterMethods: {},
      // 一些组合校验 
      validate: {}
    })

  news.associate = (models => {
    // 一对一关联
    // 使用了foreignKey选项，外键名都会使用此选项值
    news.belongsTo(models.user, { foreignKey: 'user_id' })
  })

  return news
}
