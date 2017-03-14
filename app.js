var express = require("express"),
    //bodyParser = require("body-parser"),
    exSession = require("express-session");
var User = require("./models/users").User;
var Router = require("./routes")
var sessionMiddleware = require("./middlewares/session")
var methodOverride = require("method-override")
var formidable = require("express-formidable")
var RedisStore = require("connect-redis")(exSession);
var app = express();

/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})) */


app.use("/public",express.static('public'))
var session_Middleware = exSession({
    store: new RedisStore({}),
    secret: "ultra motherfucker secret word"
})
app.use(session_Middleware);
app.use(formidable({ keepExtensions: true} ));

app.use(methodOverride("_method"))

app.set("view engine","pug")
app.get("/",function(req,res){
    console.log(req.session.userId)
    res.render("index")
})
app.get("/singup",function(req,res){
    res.render("singup")
})
app.get("/login",function(req,res){
    res.render("login")
})
app.post("/singup",function(req,res){
    var user = new User({
        email: req.fields.email,
        password: req.fields.password,
        passwordConfirmation: req.fields.passwordConfirmation,
        username: req.fields.username
    })
    console.log(req.fields.passwordConfirmation)
    user.save().then(function(us){
        res.send("Guardamos exitosamente tus datos")
        res.render("app/imagenes")
    },function(err){
        console.log(String(err))
    })
})
app.post("/session",function(req,res){
    User.findOne({email: req.fields.email, password: req.fields.password},function(err,docs){
        if(err){
            console.log(err)
            res.redirect("/")
        }else{
            console.log(docs)
            req.session.userId = docs._id
            res.redirect("app")
        }
    })
});
app.use("/app", sessionMiddleware);
app.use("/app", Router);

app.listen(8080);
