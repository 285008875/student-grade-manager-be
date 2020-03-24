// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = require('./index.js')
// // const RolePrivilege = require('./role_privilege.js')
// class Privilege extends Model { }
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PrivilegeSchema = new Schema({
  privilegeName: {
    type: String,

  },
  privilegeURL: {
    type: String,
  },
  icon: {
    type: String,

  }
}, {
  _id: false
})
module.exports = PrivilegeSchema;