var User = require("../models/users").User;
module.exports = function(req,res,next){
    if(!req.session.userId){
        res.redirect("/login")
    }
    else{
      User.findById(req.session.userId,function(err,docs){
        if(err){
          console.log(err)
          res.redirect("/login")
          return;
        }else{
          res.locals = {user: docs};
          next();
        }
      })
    }
}
