/* jshint indent: 2 */
const mongoose = require('mongoose');
const {

  comparePassword,

} = require('../auth/auth')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  "_id": {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: '807adccab890c17947d0d168c9562eba'
  },
  sex: {
    type: String,
    default: "男"
  },
  age: {
    type: Number,
    min: 18,
    max: 65
  },
  email: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  classId: {
    type: Number,
    ref: 'Class',
  },
  roleId: {
    type: String,
    ref: 'Role',
    default: "s123"
  }
}, {
  _id: false
});

UserSchema.statics.verifyUser = async function (user) {
  // 查询用户并关联权限
  const temp = await this.findOne({
    _id: user.username
  }).populate('roleId', {
    roleName: 1,
    privilege: 1
  })
  // console.log(temp)
  if (temp != null && comparePassword(user.password, temp.password)) {

    return temp.toObject()
  }

  return false

};

const User = mongoose.model('User', UserSchema)
module.exports = User;














// const sequelize = require('./index.js')
// const Role = require('./role.js')
// const Class = require('./class.js')
// class Student extends Model { }
// Student.init({
//   studentID: {
//     type: DataTypes.STRING(12),
//     allowNull: false,
//     primaryKey: true
//   },
//   studentName: {
//     type: DataTypes.STRING(10),
//     allowNull: true
//   },
//   password: {
//     type: DataTypes.STRING(35),
//     allowNull: true,
//     defaultValue: '807adccab890c17947d0d168c9562eba'
//   },
//   sex: {
//     type: DataTypes.STRING(4),
//     allowNull: true
//   },
//   email: {
//     type: DataTypes.STRING(26),
//     allowNull: true
//   },
//   tel: {
//     type: DataTypes.STRING(12),
//     allowNull: true
//   },
//   classID: {
//     type: DataTypes.STRING(10),
//     allowNull: true,
//     references: {
//       model: 'class',
//       key: 'classID'
//     }
//   },
//   roleID: {
//     type: DataTypes.STRING(6),
//     allowNull: true,
//     defaultValue: 's123',
//     references: {
//       model: 'role',
//       key: 'roleID'
//     }
//   }
// }, {
//   tableName: 'student',
//   sequelize,
//   modelName: 'Student'
// });
// Student.belongsTo(Role, { foreignKey: 'roleID', })
// Student.belongsTo(Class, { foreignKey: 'classID', })
// // Role.hasOne(Student)
// module.exports = Student;