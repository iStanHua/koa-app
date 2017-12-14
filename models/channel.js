//  频道表
module.exports = function (sequelize, DataTypes) {
  const channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '名称'
    },
    name_en: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: '英文名称'
    },
    active: {
      type: DataTypes.TINYINT(2),
      defaultValue: 1,
      comment: '1：显示；0：不显示'
    }
  },
    {
      tableName: 't_channel',
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    })

  channel.associate = (models => {
    channel.hasMany(models.news)
  })

  return channel
}
