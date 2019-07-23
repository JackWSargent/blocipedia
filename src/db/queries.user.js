const User = require("./models").User;
const bcrypt = require("bcryptjs");
module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      email: newUser.email,
      username: newUser.username,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getUser(id, callback){
    let result = {};
    User.findByPk(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
       result["user"] = user;
      }
    })
  },
  getAllUsers(callback){
    return User.findAll()
    .then((users) => {
      callback(null, users);
    })
    .catch((err) => {
        console.log("error : " + err);
      callback(err);
    })
  },
  upgradeToPremium(id, callback){
    return User.findByPk(id)
    .then((user) => {
      if(!user){
        return callback("No user");
      } else {
        return user.updateAttributes({role: 1});
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    })
  },
  downgradeToFree(id, callback){
    return User.findByPk(id)
    .then((user) => {
      if(!user){
        return callback("No user");
      } else {
        return user.updateAttributes({role: 0});
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    })
  }
}