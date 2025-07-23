import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import productsRouter from "./src/routes/products.routes.js"
import authRouter from "./src/routes/auth.routes.js"
import {auth} from "./src/middlewares/auth.middleware.js"
const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use("/api",productsRouter)

app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 3001

app.listen(PORT, console.log(`Servidor corriendo en el puerto ${PORT}`))

