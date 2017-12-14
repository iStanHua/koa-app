//  新闻表
module.exports = function (sequelize, DataTypes) {
  const news = sequelize.define('news', {
    news_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '新闻编号',
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '标题',
      validate: {
        len: [8, 100],
      }
    },
    abstract: {
      type: DataTypes.STRING(200),
      comment: '摘要'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '内容'
    },
    image: {
      type: DataTypes.STRING(100),
      comment: '图片'
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
    },
    active: {
      type: DataTypes.TINYINT(2),
      defaultValue: 1,
      comment: '1：显示；0：不显示'
    },
    editor: {
      type: DataTypes.STRING(20)
    },
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
    news.belongsTo(models.channel, { foreignKey: 'channel_id' })
    news.belongsTo(models.source, { foreignKey: 'source_id' })
  })

  return news
}
