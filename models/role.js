const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PrivilegeSchema = require('./privilege')
const RoleSchema = new Schema({
  _id: {
    type: String,
    required: true,
    index: true,
  },
  roleName: {
    type: String,
  },
  privilege: [PrivilegeSchema]
}, {
  _id: false
})
const Role = mongoose.model('Role', RoleSchema)
module.exports = Role;