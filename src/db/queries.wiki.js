const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/wiki");
const Collaborator = require("./models").Collaborator;
module.exports = {
  getAllWikis(callback){
    Wiki.findAll({
      include: [{
           model: Collaborator, as: "collaborators", attributes: ["userId"]
      }],
    })
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
      //console.log("adding wiki");
    return Wiki.create({
      name: newwiki.name,
      body: newwiki.body,
      private: newwiki.private,
      userId: newwiki.userId
    })
    .then((wiki) => {
        //console.log("wiki is " + wiki);
      callback(null, wiki);
    })
    .catch((err) => {
        console.log("error reached in query " + err);
      callback(err);
    })
  },
  getWiki(id, callback){
    let results = {}
      //console.log(id);
    return Wiki.findByPk(id)
    .then((wiki) => {
      //console.log("wiki found");
      //console.log(wiki);
      if(!wiki){
        callback(404);
      } else {
        results["wiki"] = wiki;
        Collaborator.scope({method: ["collaborators", id]}).findAll()
        .then((collaborators) => {
          results["collaborators"] = collaborators;
          callback(null, results)
        })
        .catch((err) => {
          console.log(err);
        })
      }
    })
    .catch((err) => {
        console.log("could not find it");
        console.log(err);
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
  makeWikisPublic(id){
    return Wiki.findAll()
    .then((wikis) => {
      wikis.forEach(wiki => {
        if(wiki && wiki.userId == id){
          wiki.update({private: false})
        }
      });
    })
    .catch((err) => {
      console.log(err);
    })
  },
}