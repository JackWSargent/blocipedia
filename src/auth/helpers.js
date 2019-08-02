const bcrypt = require("bcryptjs");
module.exports = {
  ensureAuthenticated(req, res, next) {
    if (!req.user){
      req.flash("notice", "You must be signed in to do that.")
      console.log("Must be signed in");
      return res.redirect("/users/sign_in");
    } else {
      next();
    }
  },
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}