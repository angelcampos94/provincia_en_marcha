var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var imgSchema = new Schema({
    title:{type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    extension: {type: String, required: true}
})
var Imagen = mongoose.model("Imagen",imgSchema);
module.exports = Imagen;
