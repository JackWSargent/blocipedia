const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/wiki");
const User = require("./models").User;
const Wiki = require("./models").Wiki;

module.exports = {
    new(req, callback){
            if(req.user.username === req.body.collaborator){ //Cannot add the same user as the one that is acting on this action
                return callback("Cannot add yourself");
            }
            User.findAll({
                where: req.body.collaborator
            })
            .then((users) => {
                if(!users){
                    return callback("Users not found");
                }
                Collaborator.findAll({
                    where: {
                        userId: users[0].id,
                        wikiId: req.params.wikiId //Check wiki queries 
                    }
                })
                .then((collaborator) => {
                    if(collaborator.length != 0){ //Already in the collaborator association
                        return callback(`${req.body.collaborator} is already in the collaborators`);
                    }
                })
                let newCollaborator = {
                    userId: users[0].id,
                    wikiId: req.params.wikiId
                }
                return Collaborator.create(newCollaborator)
                    .then((collaborator) => {
                        callback(null, collaborator);
                    })
                    .catch((err) => {
                        callback(null, err);
                    })
                .catch((err) => {
                    callback(null, err);
                })
            })
            .catch((err) => {
                callback(null, err);
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
