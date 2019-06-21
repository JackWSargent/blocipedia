require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const logger = require("morgan");
module.exports = {
    init(app, express){
        app.set("views", viewsFolder);
        app.set("view engine", "ejs");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use((req,res,next) => {
            res.locals.currentUser = req.user;
            next();
        })
        app.use(express.static(path.join(__dirname, "..", "assets")));
        app.use(logger('dev'));
        app.use(flash());
        passportConfig.init(app);
        app.use(expressValidator());
      }
};