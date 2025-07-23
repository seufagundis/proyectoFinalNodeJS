import * as model from "../models/auth.models.js"
import jwt from "jsonwebtoken"

export const login = async (email, password) =>{
    const usuario = await model.login(email)
    if(email == usuario.email && password == usuario.password){
        const payload =  {id: usuario.id}
        const expiration = {expiresIn: "1h"}
        const token = jwt.sign(payload, process.env.JWT_SECRET, expiration)
        // res.json({token})
        return token

    } else {
        console.log("Las credenciales no coinciden")

    }
}