const collaboratorQueries = ("../db/queries.collaborator.js");
const Authorizer = require("../policies/application");
const wikiQueries = ("../db/queries.wiki.js");

module.exports = {
    new(req, callback){
        collaboratorQueries.new(req, (err, collaborator) => {
            if(err){
                console.log(err);
                req.flash("error", err);
            } 
            res.redirect(req.headers.referer)
        })
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            wiki = wiki["wiki"];
            collaborator = wiki["collaborator"];
            if(err || wiki == null){
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if(authorized){
                    res.render("collaborators/edit", {wiki, collaborators})
                } else {
                    req.flash("notice", "You are not authorized to edit collaborators/wiki.");
                    res.redirect(`/wikis/${req.params.wikiId}`);
                }
            }
        })
    },
    delete(req, res, next){
        if(!req.user){
            collaboratorQueries.delete(req, (err, collaborator) => {
                    if(err){
                        console.log(err);
                        res.redirect(`/wikis/` + req.params.id);
                } else {
                    res.redirect(req.headers.referer);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that, user has to be valid");
            res.redirect(req.headers.referer);
        }
    }
}