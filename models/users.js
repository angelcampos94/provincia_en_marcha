var mongoose = require("mongoose")
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/vfDigital")
var passwordValidation= {
    validator:function(p){
        return this.passwordConfirmation == p
    },
    message: "Las Contraseñas no son las mismas."
}
var generos = ["M","F"]
var emailMatch=[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,"Coloca un email válido"]
var userSchema = new Schema({
    name: String,
    lastName: String,
    username: {type: String, required: true, maxlength:[50, "Usrname muy largo"]},
    email: {type: String, required: "Este campo es obligatorio", match:emailMatch},
    password: {type: String, required: true, minlength:[8, "Contraseña muy corta"], validate:passwordValidation},
    birthDay: Date,
    age: {type: Number, min: [5,"La edad no puede ser menor que 5"],max: [100,"La edad no puede ser mayor que 100"]},
    sex: {type: String, enum:{values: generos, message: "Opcion no válida"}}
});

userSchema.virtual("passwordConfirmation").get(function(){
    return this.pC;
}).set(function(password){
    this.pC = password
});

var User = mongoose.model("User",userSchema);
module.exports.User  = User;
