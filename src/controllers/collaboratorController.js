const collaboratorQueries = require("../db/queries.collaborator.js");
const wikiQueries = require("../db/queries.wiki.js");
const Authorizer = require("../policies/application");


module.exports = {
    new(req, res, next){
        collaboratorQueries.new(req, (err, collaborator) => {
            if(err){
                req.flash("error", err);
                console.log(err);
            }
            //console.log("Redirecting back");
            //console.log("redirecting to " + req.headers.referer);
            res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
        });
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
    show(req, res, next){
        
    },
    delete(req, res, next){
        if(req.user){
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