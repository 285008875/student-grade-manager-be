const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
// const RolePrivilege = require('./role_privilege.js')
class Privilege extends Model { }

Privilege.init({
  privilegeID: {
    type: DataTypes.STRING(6),
    allowNull: false,
    primaryKey: true
  },
  privilegeName: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  privilegeURL: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(15),
    allowNull: true
  }
}, {
  tableName: 'privilege',
  sequelize,
  modelName: 'Privilege'
});
// Privilege.hasMany(RolePrivilege)
// RolePrivilege.belongsTo(Privilege)
// Privilege.hasMany(RolePrivilege)
module.exports = Privilege;

