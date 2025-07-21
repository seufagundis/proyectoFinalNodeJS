import { error } from "console"
import jwt from "jsonwebtoken"

const usuario = {
    id: 1,
    email: "fac.san1091@gmail.com",
    password: "1234"
}

export const login = (req,res)=>{
    const {email,password} = req.body
    const user = {id: 1, email}

    if(email == usuario.email && password == usuario.password){
        const payload =  {id: user.id}
        const expiration = {expiresIn: "1h"}
        const token = jwt.sign(payload, process.env.JWT_SECRET, expiration)
        res.json({token})

    } else {
        res.status(401).json({error: "Las credenciales no coinciden"})

    }

}