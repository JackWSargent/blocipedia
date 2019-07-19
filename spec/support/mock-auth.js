module.exports = {
    fakeIt(app){
    let role, username, id, email;
    function middleware(req,res,next){
        username = req.body.username || username;
        id = req.body.userId || id;
        email = req.body.email || email;
        role = req.body.role || role;
    if(id && id != 0){
        req.user = {
            "id": id,
            "email": email,
            "username": username,
            "role": role
        };
    } else if(id == 0) {
        delete req.user;
    }
    if( next ){ next() }
    }
    function route(req,res){
        res.redirect("/")
    }
    app.use(middleware)
    app.get("/auth/fake", route)
    }
}