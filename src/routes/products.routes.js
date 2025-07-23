import { Router } from "express"

import * as productsController from "../controllers/products.controller.js"

import { auth } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/products", productsController.getAllProducts)

router.get("/products/:id", productsController.getProductById)

router.post("/products/create", auth, productsController.createProduct)

router.delete("/products/:id", auth, productsController.deleteProduct)

export default router