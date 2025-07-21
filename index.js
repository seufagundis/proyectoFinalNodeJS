import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import productsRouter from "./src/routes/products.routes.js"

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use("/api", productsRouter)

const PORT = 3000

app.listen(PORT, console.log(`Servidor corriendo en el puerto ${PORT}`))

