import * as productsServices from "../services/products.services.js"

export const getAllProducts = async (req, res)=> {
    try {
        const productos = await productsServices.getAllProducts()
        res.status(200).json(productos)
    } catch (error) {
        console.error(error)
         res.status(500).json({ message: "Error al obtener el productos"  })
    }

}
export const getProductById = async (req, res)=> {
    try {
        const producto = await productsServices.getProductById(req.params.id)
         if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }
        res.status(200).json(producto)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al obtener el producto"  })
    }

}
export const createProduct = async (req, res)=> {
    try {
        const producto = await productsServices.createProduct(req.body)
        res.status(201).json({ message: "Producto creado", producto })
        
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message + "Error al crear el producto" })
    }

}
export const deleteProduct = async (req, res)=> {
    try {
        const producto = await productsServices.deleteProduct(req.params.id)
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }
        res.status(200).json({ message: "Producto eliminado", producto })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al eliminar el producto" })
    }

}