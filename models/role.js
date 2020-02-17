const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./index.js')
const Privilege = require('./privilege.js')
class Role extends Model { }

Role.init({
  roleID: {
    type: DataTypes.STRING(6),
    allowNull: false,
    primaryKey: true
  },
  roleName: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'role',
  sequelize,
  modelName: 'Role'
});
Role.hasMany(Privilege, { foreignKey: 'roleID', })


// Role.hasMany(RolePrivilege, { foreignKey: 'roleID', })
// RolePrivilege.belongsTo(Role)
module.exports = Role;

