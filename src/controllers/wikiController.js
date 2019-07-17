const wikiQueries = require("../db/queries.wiki.js");
//const Authorizer = require("../policies/wikis");

module.exports = {
    index(req,res,next) {
        console.log("Getting wiks");
        wikiQueries.getAllWikis((err, wikis) => {
            if(err){
                res.redirect(500, "static/index")
            } else {
                res.render("wikis/index", {wikis});
            }
        })
    },
    new(req,res,next){
        const authorized = true;
        if(authorized){
            res.render("wikis/new")
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
        }
    },
    create(req,res,next){ 
        //console.log("creating new wiki");
        const authorized = true;
        if(authorized){
            let newwiki = {
                name: req.body.name,
                body: req.body.body,
            }
            wikiQueries.addWiki(newwiki, (err, wiki) => {
                if(err){
                    //console.log("wiki error in controller");
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
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if(err || wiki === null){
                //console.log("did not find wiki");
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {wiki});
            }
        })
    },
    destroy(req, res, next){
        //console.log("destroying in controller");
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){
                //console.log("error in controller");
                res.redirect(`/wikis/` + req.params.id)
            } else {
                res.redirect(303, "/wikis");
            }
        })
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
          if(err || wiki == null){
            res.redirect(404, "/");
          } else {
          const authorized = true;
          if(authorized){
            res.render("wikis/edit", {wiki});
          } else {
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
      }
}