import { error } from "console"

import * as authService from "../services/auth.services.js"

export const login = async (req,res)=>{
    const {email,password} = req.body
  
    try {
        const token = await authService.login(email,password)
        res.status(200).json(token)
    } catch (error) {
        res.status(401).json({error: error.message})
    }
    

}