const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");
module.exports = {
  getAllWikis(callback){
    return Wiki.findAll()
    .then((wikis) => {
        //console.log("Found all wikis");
      callback(null, wikis);
    })
    .catch((err) => {
        console.log("error : " + err);
      callback(err);
    })
  },
  addWiki(newwiki, callback){
      console.log("adding wiki");
    return Wiki.create({
      name: newwiki.name,
      body: newwiki.body,
      private: newwiki.private,
      userId: newwiki.userId
    })
    .then((wiki) => {
        console.log("wiki is " + wiki);
      callback(null, wiki);
    })
    .catch((err) => {
        console.log("error reached in query " + err);
      callback(err);
    })
  },
  getWiki(id, callback){
      //console.log(id);
    return Wiki.findByPk(id)
    .then((wiki) => {
        //console.log("wiki found");
        //console.log(wiki);
      callback(null, wiki);
    })
    .catch((err) => {
        //console.log("could not find it");
        //console.log(err);
      callback(err);
    })
  },
  deleteWiki(req, callback){
      //console.log("in query");
    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
        //console.log("found wiki");
      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized) {
        wiki.destroy()
        .then((res) => {
            //console.log("wiki destroyed");
          callback(null, wiki);
        });  
      } else {
          //console.log("not authorized");
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
        //console.log("did not find wiki");
      callback(err);
    });
  },
  updateWiki(req, updatedwiki, callback){
    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("wiki not found");
      }
      const authorized = new Authorizer(req.user, wiki).update();
      if(authorized) {
        wiki.update(updatedwiki, {
          fields: Object.keys(updatedwiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },
  changeToPublic(id){
    return Wiki.findAll({attributes: [userId, [id]]})
    .then((wiki) => {
      wiki.private = false;
    })
  }
}