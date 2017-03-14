var express = require("express");
var router = express.Router();
var Imagen = require("./models/imagenes")
var imageFinder = require("./middlewares/findImage")
var fs = require("fs")
router.get("/",function(req,res){
  Imagen.find({})
    .populate("creator")
    .exec(function(err,docs){
      if(err){
        console.log(err)
        res.redirect("/login")
      }else{
        res.render("app/home",{imagenes: docs})
      }
    })
})
router.get("/imagenes/new",function(req,res){
	res.render("app/imagenes/new")
})

router.all("/imagenes/:id*",imageFinder)

router.get("/imagenes/:id/edit",function(req,res){
  res.render("app/imagenes/edit")
})
// REST
router.route("/imagenes/:id")
.get(function(req,res){
    res.render("app/imagenes/show")
})
.put(function(req,res){
  res.locals.docs.title = req.body.title;
  res.locals.docs.save(function(err){
      if(!err){
          res.render("app/imagenes/show")
      }else{
          res.render("app/imagenes/"+req.params.id+"/edit")
      }
  })
})
.delete(function(req,res){
    Imagen.findOneAndRemove({_id: req.params.id}, function(err){
        if(!err){
            console.log("lo que sea "+req.params.id)
            res.redirect("/app/imagenes");
        }else{
            console.log("Entre :D")
            console.log(err);
            res.redirect("/app/imagenes/"+req.params.id)
        }
    })
})

router.route("/imagenes")
.get(function(req,res){
    Imagen.find({creator: res.locals.user._id},function(err,docs){
        if(err){
          res.redirect("/app"); return;
        }else{
          res.locals.user._id
          res.render("app/imagenes/index",{imagenes: docs})
        }
    })
})
.post(function(req,res){
  /*console.log(req.fields)
  console.log(req.files)*/
    var ext = req.files.imagen.name.split(".").pop()
    console.log(ext)
    var data = {
        title: req.fields.title,
        creator: res.locals.user._id,
        extension: ext
    }
    var imagen = new Imagen(data)
    imagen.save(function(err){
        if(!err){
            fs.rename(req.files.imagen.path, "public/imagenes/"+imagen._id+"."+ext)
            res.redirect("/app/imagenes/"+imagen._id)
        }else{
            console.log(err)
            res.redirect("/app")
        }
    })
})

module.exports = router;
