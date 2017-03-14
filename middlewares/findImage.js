var Imagen = require("../models/imagenes")
var check_own = require("./imagePermission")
module.exports = function(req,res,next){
  Imagen.findById(req.params.id)
  .populate("creator")
  .exec(function(err,docs){
    if(docs != null && check_own(docs,req,res)){
      console.log("¡Encontre la imagen! "+ docs.creator)
      res.locals.imagen = docs;
      next();
    }else{
      res.redirect("/app")
    }
  })
}
