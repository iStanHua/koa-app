//  来源表
module.exports = function (sequelize, DataTypes) {
  const source = sequelize.define('source', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '名称'
    },
    active: {
      type: DataTypes.TINYINT(2),
      defaultValue: 1,
      comment: '1：显示；0：不显示'
    }
  },
    {
      tableName: 't_source',
      indexes: [
        {
          unique: true,
          fields: ['id']
        }
      ]
    })

  source.associate = (models => {
    source.hasMany(models.news)
  })

  return source
}
