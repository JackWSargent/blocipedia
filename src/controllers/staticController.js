module.exports = {
    index(req, res, next){
        console.log("getting index");
        res.render("static/index", {title: "Welcome to Blocipedia"});
    },
}