const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
class SchoolCircle extends Model { }

SchoolCircle.init({
  titleID: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true
  },
  content: {
    type: "BLOB",
    allowNull: true
  },
  createTime: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  praise: {
    type: DataTypes.INTEGER(10),
    allowNull: true
  },
  authorID: {
    type: DataTypes.STRING(12),
    allowNull: true,
    references: {
      model: 'student',
      key: 'studentID'
    }
  }
}, {
  tableName: 'schoolcircle',
  sequelize,
  modelName: 'SchoolCircle'
});
module.exports = SchoolCircle;