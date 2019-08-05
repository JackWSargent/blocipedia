const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/wiki");
const User = require("./models").User;
const Wiki = require("./models").Wiki;

module.exports = {
    new(req, callback){
        if (req.user.username == req.body.collaborator){
          return callback("Cannot add yourself to collaborators!");
        }
        User.findAll({
          where: {
            username: req.body.collaborator
          }
        })
        .then((users)=>{
          if(!users[0]){
            return callback("User not found.");
          }
          Collaborator.findAll({
            where: {
              userId: users[0].id,
              wikiId: req.params.wikiId,
            }
          })
          .then((collaborators)=>{
            if(collaborators.length != 0){
              return callback(`${req.body.collaborator} is already a collaborator on this wiki.`);
            }
            let newCollaborator = {
              userId: users[0].id,
              wikiId: req.params.wikiId
            };
            return Collaborator.create(newCollaborator)
            .then((collaborator) => {
                console.log("success " + collaborator);
              callback(null, collaborator);
            })
            .catch((err) => {
                console.log("error3" + err);
              callback(err, null);
            })
          })
          .catch((err)=>{
            console.log("error2" + err);
            callback(err, null);
          })
        })
        .catch((err)=>{
            console.log("error" + err);
          callback(err, null);
        })
    },
    delete(){
        const collaboratorId = req.body.collaborator;
        const wikiId = req.params.wikiId;
        const authorized = new Authorizer(req.user, wiki).destroy();
        if(authorized){
            Collaborator.destroy({ where: {
            userId : collaboratorId,
            wikiId : wikiId
        }})
            .then((deleted) => {
                callback(null, deleted);
        })
        .catch((err) => {
            callback(err);
        });
        } else {
            req.flash("notice", "You are not authorized to remove collaborators")
            callback(401);
        }
    }
}
