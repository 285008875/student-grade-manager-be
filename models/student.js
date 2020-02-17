/* jshint indent: 2 */
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
const Role = require('./role.js')
class Student extends Model { }
Student.init({
  studentID: {
    type: DataTypes.STRING(12),
    allowNull: false,
    primaryKey: true
  },
  studentName: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(35),
    allowNull: true,
    defaultValue: '807adccab890c17947d0d168c9562eba'
  },
  sex: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(26),
    allowNull: true
  },
  tel: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  classID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'class',
      key: 'classID'
    }
  },
  roleID: {
    type: DataTypes.STRING(6),
    allowNull: true,
    defaultValue: 's123',
    references: {
      model: 'role',
      key: 'roleID'
    }
  }
}, {
  tableName: 'student',
  sequelize,
  modelName: 'Student'
});
Student.belongsTo(Role, { foreignKey: 'roleID', })
// Role.hasOne(Student)
module.exports = Student;