import express from "express";

import * as productsController from "../controllers/products.controller.js"

const router = express.Router()

router.get("/products", productsController.getAllProducts)

router.get("/products/:id",productsController.getProductById)

router.post("/products/create", productsController.createProduct)

router.delete("/products/:id", productsController.deleteProduct)

export default router