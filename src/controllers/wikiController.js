const wikiQueries = require("../db/queries.wiki.js");
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;
const collaborator = require("../db/models").Collaborator;
module.exports = {
    index(req,res,next) {
        //console.log("Getting wiks");
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index")
            } else {
                res.render("wikis/index", {wikis});
            }
        })
    },
    private(req,res,next) {
        console.log("Getting private wikis");
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index")
            } else {
               console.log('wiki is:', wikis)
                console.log('collaborator is:', collaborator)
                res.render("wikis/private", {wikis, collaborator});
            }
        })
    },
    new(req,res,next){
        const authorized = new Authorizer(req.user).new();
        if(authorized){
            res.render("wikis/new")
        } else {
            console.log("Not authorized");
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    create(req,res,next){ 
        //console.log("creating new wiki");
        const authorized = new Authorizer(req.user).create();
        if(authorized){
            let newwiki = {
                name: req.body.name,
                body: req.body.body,
                private: req.body.private,
                userId: req.user.id
            }
            wikiQueries.addWiki(newwiki, (err, wiki) => {
                if(err){
                    console.log("wiki error in controller");
                    res.redirect(500, "wikis/new");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    show(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, results) => {
            wiki = results["wiki"];
            collaborators = results["collaborators"];
            if(err || wiki === null){
                console.log(err);
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if(authorized){
                    console.log("Authorized");
                    wiki.body = markdown.toHTML(wiki.body);
                    res.render("wikis/show", {wiki});
                } else {
                    console.log("Not authorized");
                    req.flash("notice", "Not authorized to show collaborators");
                    res.redirect("/wikis")
                }
            }
        })
    },
    destroy(req, res, next){
        //console.log("destroying in controller");
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                //console.log("error destroying in controller");
                res.redirect(`/wikis/` + req.params.id)
            } else {
                //console.log("not authorized to destroy");
                res.redirect(303, "/wikis");
            }
        })
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, result) => {
            wiki = result["wiki"];
            collaborators = result["collaborators"]
          if(err || wiki == null){
            //console.log(err);
            res.redirect(404, "/");
          } else {
            const authorized = new Authorizer(req.user, wiki).edit();
            if(authorized){
                //console.log(wiki);
                res.render("wikis/edit", {wiki});
            } else {
                //console.log("not authorized");
                req.flash("You are not authorized to do that.")
                res.redirect(`/wikis/${req.params.id}`)
            }
          }
        });
    },
    update(req, res, next){
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
          if(err || wiki == null){
            res.redirect(401, `/wikis/${req.params.id}/edit`);
          } else {
            res.redirect(`/wikis/${req.params.id}`);
          }
        });
    },
}