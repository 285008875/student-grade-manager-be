const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js');
const Role = require('./role.js')
class Teacher extends Model { }
Teacher.init({
  teacherID: {
    type: DataTypes.STRING(12),
    allowNull: false,
    primaryKey: true
  },
  teacherName: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER(2).UNSIGNED,
    allowNull: true
  },
  tel: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(26),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(35),
    allowNull: true,
    defaultValue: '807adccab890c17947d0d168c9562eba'
  },
  majorID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'major',
      key: 'majorID'
    }
  },
  roleID: {
    type: DataTypes.STRING(6),
    allowNull: true,
    defaultValue: 't123',
    references: {
      model: 'role',
      key: 'roleID'
    }
  }
}, {
  tableName: 'teacher',
  sequelize,
  modelName: 'Teacher'
});
Teacher.belongsTo(Role, { foreignKey: 'roleID', })
module.exports = Teacher;